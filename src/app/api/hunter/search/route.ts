import { NextRequest, NextResponse } from "next/server";
import { extractCarInfo, checkCompatibility } from "@/lib/hunter/translations";
import { HunterResult } from "@/types/gse";

interface HunterSearchRequest {
  partName: string;
  compatibility?: string[];
  oemCode?: string;
  userText?: string;
}

interface SerperShoppingResult {
  title: string;
  link: string;
  price?: string;
  currency?: string;
  source: string;
  thumbnail?: string;
  rating?: number;
  reviews?: number;
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("[Hunter] Recebida requisição de busca");
    }

    if (!process.env.SERPER_API_KEY) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Hunter] SERPER_API_KEY não configurada");
      }
      return NextResponse.json(
        { error: "SERPER_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const body: HunterSearchRequest = await request.json();

    if (process.env.NODE_ENV === "development") {
      console.log("[Hunter] Buscando:", {
        partName: body.partName,
        oemCode: body.oemCode,
        compatibility: body.compatibility,
        hasUserText: !!body.userText,
      });
    }

    if (!body.partName || body.partName.trim().length === 0) {
      return NextResponse.json(
        { error: "Nome da peça é obrigatório" },
        { status: 400 }
      );
    }

    const carInfo = body.userText
      ? extractCarInfo(body.userText)
      : body.compatibility && body.compatibility.length > 0
      ? extractCarInfo(body.compatibility[0])
      : {};

    const trustedMarketplaces = [
      "ebay.com",
      "rockauto.com",
      "amazon.com",
      "partsgeek.com",
      "autozone.com",
      "oreillyauto.com",
    ];

    const forumSites = [
      "site:reddit.com",
      "site:forum*",
      "site:stackoverflow.com",
      "site:quora.com",
    ];

    const siteQuery = trustedMarketplaces
      .map((site) => `site:${site}`)
      .join(" OR ");

    const forumQuery = forumSites.join(" OR ");

    let primaryQuery = "";
    let fallbackQuery = "";

    if (body.oemCode && body.oemCode.trim().length > 0) {
      const oemCode = body.oemCode.trim();
      primaryQuery = `"${oemCode}" (${siteQuery})`;
      
      const queryParts = [body.partName];
      if (body.compatibility && body.compatibility.length > 0) {
        queryParts.push(body.compatibility[0]);
      }
      queryParts.push(oemCode);
      fallbackQuery = `${queryParts.join(" ")} (${siteQuery})`;
    } else {
      const queryParts = [body.partName];
      if (body.compatibility && body.compatibility.length > 0) {
        queryParts.push(body.compatibility[0]);
      }
      if (body.userText) {
        const userTerms = body.userText
          .split(/\s+/)
          .filter((term) => term.length > 3)
          .slice(0, 3);
        queryParts.push(...userTerms);
      }
      primaryQuery = `${queryParts.join(" ")} (${siteQuery})`;
      fallbackQuery = `${body.partName} (${siteQuery})`;
    }

    const marketplaceQuery = primaryQuery;
    const forumSearchQuery = `${body.partName} (${forumQuery})`;

    if (process.env.NODE_ENV === "development") {
      console.log("[Hunter] Query marketplaces:", marketplaceQuery);
      console.log("[Hunter] Query fóruns:", forumSearchQuery);
    }

    const [marketplaceResponse, forumResponse] = await Promise.all([
      fetch("https://google.serper.dev/shopping", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: marketplaceQuery,
          num: 10,
        }),
      }),
      fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: forumSearchQuery,
          num: 5,
        }),
      }),
    ]);

    if (!marketplaceResponse.ok) {
      const errorText = await marketplaceResponse.text();
      console.error("[Hunter] Erro Serper.dev:", marketplaceResponse.status, errorText);
      return NextResponse.json(
        { error: "Erro ao buscar peças. Tente novamente." },
        { status: marketplaceResponse.status }
      );
    }

    const marketplaceData = await marketplaceResponse.json();
    const shoppingResults: SerperShoppingResult[] =
      marketplaceData.shopping || marketplaceData.organic || [];

    let forumResults: SerperShoppingResult[] = [];
    if (forumResponse.ok) {
      const forumData = await forumResponse.json();
      forumResults = (forumData.organic || []).slice(0, 3).map((item: any) => ({
        title: item.title || "",
        link: item.link || "",
        source: item.source || "",
        thumbnail: item.thumbnail,
      }));
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[Hunter] Resultados encontrados:", shoppingResults.length);
    }

    let results: HunterResult[] = shoppingResults
      .slice(0, 8)
      .map((item) => {
        const priceMatch = item.price?.match(/[\d,]+\.?\d*/);
        const price = priceMatch
          ? parseFloat(priceMatch[0].replace(/,/g, ""))
          : 0;

        const currency = item.currency || "USD";

        const marketplace = extractMarketplace(item.link);
        const seller = extractSeller(item.source, item.link);

        const compatibility = checkCompatibility(
          item.title || "",
          item.link,
          carInfo.brand,
          carInfo.model,
          carInfo.year
        );

        return {
          title: item.title || "Sem título",
          url: item.link,
          price,
          currency,
          seller,
          marketplace,
          imageUrl: item.thumbnail,
          rating: item.rating,
          compatibility,
        };
      })
      .filter((item) => item.price > 0)
      .sort((a, b) => {
        if (a.compatibility === "confirmed" && b.compatibility !== "confirmed") return -1;
        if (b.compatibility === "confirmed" && a.compatibility !== "confirmed") return 1;
        if (a.compatibility === "possible" && b.compatibility === "unknown") return -1;
        if (b.compatibility === "possible" && a.compatibility === "unknown") return 1;
        return a.price - b.price;
      })
      .slice(0, 5);

    if (results.length === 0 && fallbackQuery && fallbackQuery !== marketplaceQuery) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Hunter] Tentando busca fallback:", fallbackQuery);
      }

      try {
        const fallbackResponse = await fetch("https://google.serper.dev/shopping", {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: fallbackQuery,
            num: 10,
          }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackShoppingResults: SerperShoppingResult[] =
            fallbackData.shopping || fallbackData.organic || [];

          results = fallbackShoppingResults
            .slice(0, 5)
            .map((item) => {
              const priceMatch = item.price?.match(/[\d,]+\.?\d*/);
              const price = priceMatch
                ? parseFloat(priceMatch[0].replace(/,/g, ""))
                : 0;

              const currency = item.currency || "USD";
              const marketplace = extractMarketplace(item.link);
              const seller = extractSeller(item.source, item.link);

              const compatibility = checkCompatibility(
                item.title || "",
                item.link,
                carInfo.brand,
                carInfo.model,
                carInfo.year
              );

              return {
                title: item.title || "Sem título",
                url: item.link,
                price,
                currency,
                seller,
                marketplace,
                imageUrl: item.thumbnail,
                rating: item.rating,
                compatibility,
              };
            })
            .filter((item) => item.price > 0)
            .sort((a, b) => a.price - b.price);
        }
      } catch (fallbackError) {
        if (process.env.NODE_ENV === "development") {
          console.error("[Hunter] Erro na busca fallback:", fallbackError);
        }
      }
    }

    if (results.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Hunter] Nenhum resultado válido encontrado");
      }
      return NextResponse.json(
        {
          results: [],
          error: "Peça rara. Estamos buscando alternativas genéricas e em fóruns especializados. Tente novamente em alguns instantes ou forneça mais detalhes.",
        },
        { status: 200 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[Hunter] Retornando", results.length, "resultados");
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (error: unknown) {
    console.error("Erro na API Hunter:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro interno ao buscar peças";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function extractMarketplace(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("ebay")) return "eBay";
    if (hostname.includes("rockauto")) return "RockAuto";
    if (hostname.includes("amazon")) return "Amazon";
    if (hostname.includes("partsgeek")) return "PartsGeek";
    if (hostname.includes("autozone")) return "AutoZone";
    if (hostname.includes("oreilly")) return "O'Reilly";
    return "Marketplace";
  } catch {
    return "Marketplace";
  }
}

function extractSeller(source: string, url: string): string {
  if (source && source.trim().length > 0) {
    return source;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("ebay")) {
      const match = url.match(/\/usr\/([^\/]+)/);
      if (match) return match[1];
    }
    return extractMarketplace(url);
  } catch {
    return "Vendedor";
  }
}


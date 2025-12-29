import { NextRequest, NextResponse } from "next/server";

interface HunterSearchRequest {
  partName: string;
  compatibility?: string[];
  oemCode?: string;
}

interface SearchResult {
  title: string;
  url: string;
  price: number;
  currency: string;
  seller: string;
  marketplace: string;
  imageUrl?: string;
  shippingEstimate?: string;
  rating?: number;
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
    if (!process.env.SERPER_API_KEY) {
      return NextResponse.json(
        { error: "SERPER_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const body: HunterSearchRequest = await request.json();

    if (!body.partName || body.partName.trim().length === 0) {
      return NextResponse.json(
        { error: "Nome da peça é obrigatório" },
        { status: 400 }
      );
    }

    const queryParts = [body.partName];
    if (body.compatibility && body.compatibility.length > 0) {
      queryParts.push(body.compatibility[0]);
    }
    if (body.oemCode) {
      queryParts.push(body.oemCode);
    }

    const searchQuery = queryParts.join(" ");

    const trustedMarketplaces = [
      "ebay.com",
      "rockauto.com",
      "amazon.com",
      "partsgeek.com",
      "autozone.com",
      "oreillyauto.com",
    ];

    const siteQuery = trustedMarketplaces
      .map((site) => `site:${site}`)
      .join(" OR ");

    const fullQuery = `${searchQuery} (${siteQuery})`;

    const serperResponse = await fetch("https://google.serper.dev/shopping", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: fullQuery,
        num: 10,
      }),
    });

    if (!serperResponse.ok) {
      const errorText = await serperResponse.text();
      console.error("Erro Serper.dev:", errorText);
      return NextResponse.json(
        { error: "Erro ao buscar peças. Tente novamente." },
        { status: serperResponse.status }
      );
    }

    const serperData = await serperResponse.json();
    const shoppingResults: SerperShoppingResult[] =
      serperData.shopping || serperData.organic || [];

    const results: SearchResult[] = shoppingResults
      .slice(0, 5)
      .map((item) => {
        const priceMatch = item.price?.match(/[\d,]+\.?\d*/);
        const price = priceMatch
          ? parseFloat(priceMatch[0].replace(/,/g, ""))
          : 0;

        const currency = item.currency || "USD";

        const marketplace = extractMarketplace(item.link);
        const seller = extractSeller(item.source, item.link);

        return {
          title: item.title || "Sem título",
          url: item.link,
          price,
          currency,
          seller,
          marketplace,
          imageUrl: item.thumbnail,
          rating: item.rating,
        };
      })
      .filter((item) => item.price > 0)
      .sort((a, b) => a.price - b.price);

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma peça encontrada nos marketplaces confiáveis" },
        { status: 404 }
      );
    }

    return NextResponse.json({ results });
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


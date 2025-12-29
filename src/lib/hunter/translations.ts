interface TranslationQueries {
  en: string;
  zh: string;
  ja: string;
  de: string;
}

export function generateTranslatedQueries(
  partName: string,
  compatibility?: string[],
  oemCode?: string
): TranslationQueries {
  const baseQuery = [partName];
  if (compatibility && compatibility.length > 0) {
    baseQuery.push(compatibility[0]);
  }
  if (oemCode) {
    baseQuery.push(oemCode);
  }

  const query = baseQuery.join(" ");

  return {
    en: query,
    zh: query,
    ja: query,
    de: query,
  };
}

export function extractCarInfo(text: string): {
  brand?: string;
  model?: string;
  year?: string;
} {
  const brandPatterns = [
    /\b(VW|Volkswagen|Ford|Chevrolet|Fiat|Toyota|Honda|BMW|Mercedes|Audi|Porsche)\b/gi,
  ];
  const modelPatterns = [
    /\b(Golf|Polo|Fiesta|Focus|Civic|Corolla|Camry|3 Series|C-Class|A3|A4)\b/gi,
  ];
  const yearPatterns = [/\b(19|20)\d{2}\b/g];

  let brand: string | undefined;
  let model: string | undefined;
  let year: string | undefined;

  for (const pattern of brandPatterns) {
    const match = text.match(pattern);
    if (match) {
      brand = match[0];
      break;
    }
  }

  for (const pattern of modelPatterns) {
    const match = text.match(pattern);
    if (match) {
      model = match[0];
      break;
    }
  }

  for (const pattern of yearPatterns) {
    const match = text.match(pattern);
    if (match) {
      year = match[0];
      break;
    }
  }

  return { brand, model, year };
}

export function checkCompatibility(
  resultTitle: string,
  resultUrl: string,
  userBrand?: string,
  userModel?: string,
  userYear?: string
): "confirmed" | "possible" | "unknown" {
  if (!userBrand && !userModel) {
    return "unknown";
  }

  const titleLower = resultTitle.toLowerCase();
  const urlLower = resultUrl.toLowerCase();

  const searchText = `${titleLower} ${urlLower}`;

  let brandMatch = false;
  let modelMatch = false;

  if (userBrand) {
    const brandVariants = [
      userBrand.toLowerCase(),
      userBrand.toLowerCase().replace("vw", "volkswagen"),
      userBrand.toLowerCase().replace("volkswagen", "vw"),
    ];
    brandMatch = brandVariants.some((variant) => searchText.includes(variant));
  }

  if (userModel) {
    modelMatch = searchText.includes(userModel.toLowerCase());
  }

  if (brandMatch && modelMatch) {
    return "confirmed";
  }

  if (brandMatch || modelMatch) {
    return "possible";
  }

  return "unknown";
}




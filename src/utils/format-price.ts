// src/utils/format-price.ts

/**
 * Formata um valor monetário, convertendo de moeda estrangeira para BRL quando necessário.
 * 
 * @param price O valor numérico a ser formatado.
 * @param currency A moeda original (ex: "USD", "EUR", "BRL").
 * @param exchangeRate Taxa de câmbio opcional (ex: 5.5 para USD→BRL). Se não fornecida e currency for USD, usa fallback.
 * @returns O valor formatado como string localizada (ex: "R$ 55,00" ou "$55.00").
 */
export function formatPrice(price: number, currency: string, exchangeRate?: number): string {
  // Se já está em BRL, formata diretamente
  if (currency === "BRL") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(price);
  }

  // Para USD, converte usando taxa de câmbio
  if (currency === "USD") {
    const rate = exchangeRate ?? 5.5; // Fallback se não fornecido
    const convertedPrice = price * rate;
    
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(convertedPrice);
  }

  // Para outras moedas, formata no padrão local
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(price);
}


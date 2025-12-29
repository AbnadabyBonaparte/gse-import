// src/utils/format-price.ts

/**
 * Formata um valor monetário, convertendo de USD para BRL com uma taxa fixa.
 * NOTA: A taxa de câmbio (5.5) é fixa para fins de demonstração. Em produção,
 * é altamente recomendado usar uma API de câmbio em tempo real.
 * @param price O valor numérico.
 * @param currency A moeda original (ex: "USD").
 * @returns O valor formatado como string (ex: "R$ 55,00").
 */
export const formatPrice = (price: number, currency: string): string => {
  // Taxa de câmbio fixa para BRL (apenas para fins de demonstração)
  const EXCHANGE_RATE_USD_TO_BRL = 5.5;

  if (currency === "USD") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(price * EXCHANGE_RATE_USD_TO_BRL);
  }

  // Para outras moedas, formata no padrão local
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
};

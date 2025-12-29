// src/lib/exchange-rate.ts

/**
 * Obtém taxa de câmbio dinâmica para conversão de moedas.
 * 
 * PRIORIDADE DE BUSCA:
 * 1. Variável de ambiente (apenas desenvolvimento)
 * 2. Supabase (futuro - tabela settings ou exchange_rates)
 * 3. API externa (futuro - ExchangeRate-API ou similar)
 * 4. Fallback fixo (apenas desenvolvimento)
 * 
 * @param from Moeda de origem (ex: "USD")
 * @param to Moeda de destino (ex: "BRL")
 * @returns Taxa de câmbio (ex: 5.5 significa 1 USD = 5.5 BRL)
 */
export async function getExchangeRate(from: string, to: string): Promise<number> {
  // 1. Variável de ambiente (apenas desenvolvimento)
  if (process.env.NODE_ENV === "development" && process.env.EXCHANGE_RATE_USD_TO_BRL) {
    const envRate = parseFloat(process.env.EXCHANGE_RATE_USD_TO_BRL);
    if (!isNaN(envRate) && envRate > 0) {
      if (from === "USD" && to === "BRL") {
        return envRate;
      }
    }
  }

  // 2. TODO: Buscar do Supabase (tabela settings ou exchange_rates)
  // const cachedRate = await getCachedRateFromSupabase(from, to);
  // if (cachedRate) return cachedRate;

  // 3. TODO: Buscar de API externa (ExchangeRate-API, Fixer.io, etc.)
  // const apiRate = await fetchExchangeRateFromAPI(from, to);
  // if (apiRate) {
  //   await cacheRateInSupabase(from, to, apiRate, 3600); // TTL 1h
  //   return apiRate;
  // }

  // 4. Fallback fixo (apenas desenvolvimento - NUNCA em produção)
  if (process.env.NODE_ENV === "development" && from === "USD" && to === "BRL") {
    return 5.5;
  }

  // Se não conseguir obter taxa, lança erro
  throw new Error(
    `Taxa de câmbio não disponível para ${from} → ${to}. Configure EXCHANGE_RATE_USD_TO_BRL no .env ou implemente integração com Supabase/API.`
  );
}


// src/hooks/use-exchange-rate.ts
import { useState, useEffect } from "react";
import { getExchangeRate } from "@/lib/exchange-rate";

/**
 * Hook para obter e cachear taxa de câmbio USD → BRL.
 * Busca a taxa uma vez ao montar o componente e mantém em cache.
 */
export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<number>(5.5); // Fallback inicial
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchRate() {
      try {
        const rate = await getExchangeRate("USD", "BRL");
        if (mounted) {
          setExchangeRate(rate);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao buscar taxa de câmbio:", error);
        // Mantém fallback
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRate();

    return () => {
      mounted = false;
    };
  }, []);

  return { exchangeRate, isLoading };
}



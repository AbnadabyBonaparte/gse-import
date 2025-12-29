// src/hooks/use-fiscal-calculation.ts
'use client';

import { useState } from 'react';

export interface FiscalCalculationRequest {
  price: number;
  currency: string;
  weightKg: number;
  ncm: string;
  originCountry: string;
}

export interface BreakdownItem {
  label: string;
  value: number;
  percentage?: number;
}

export interface FiscalCalculationResponse {
  breakdown: BreakdownItem[];
  totalGuaranteed: number;
  currency: 'BRL';
  guaranteeNote: string;
}

export interface UseFiscalCalculationReturn {
  calculate: (request: FiscalCalculationRequest) => Promise<FiscalCalculationResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para calcular custo total garantido via API fiscal
 */
export function useFiscalCalculation(): UseFiscalCalculationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (
    request: FiscalCalculationRequest
  ): Promise<FiscalCalculationResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fiscal/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data: FiscalCalculationResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular custo fiscal';
      setError(errorMessage);
      console.error('Erro no cálculo fiscal:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { calculate, isLoading, error };
}


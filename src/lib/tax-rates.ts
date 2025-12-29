// src/lib/tax-rates.ts
// Tabela de alíquotas fiscais para cálculo de importação
// Futuro: buscar do Supabase

export interface TaxRates {
  ii: number; // Imposto de Importação (%)
  ipi: number; // IPI (%)
}

// Mapa NCM → Alíquotas
export const NCM_TAX_RATES: Record<string, TaxRates> = {
  // Partes automotivas gerais
  '8708': { ii: 35, ipi: 15 },
  
  // Elétricos para iluminação
  '8512': { ii: 35, ipi: 10 },
  
  // Motores
  '8407': { ii: 35, ipi: 15 },
  '8408': { ii: 35, ipi: 15 },
  
  // Pneus
  '4011': { ii: 35, ipi: 15 },
  
  // Baterias
  '8507': { ii: 35, ipi: 10 },
  
  // Eletrônicos diversos
  '8517': { ii: 35, ipi: 10 },
  '8525': { ii: 35, ipi: 10 },
  '8528': { ii: 35, ipi: 10 },
  
  // Plásticos
  '3926': { ii: 35, ipi: 10 },
  
  // Metais preciosos
  '7113': { ii: 35, ipi: 5 },
  
  // Instrumentos ópticos
  '9001': { ii: 35, ipi: 10 },
  '9002': { ii: 35, ipi: 10 },
  
  // Default fallback
  'default': { ii: 35, ipi: 10 }
};

// Função para obter alíquotas com fallback
export function getTaxRates(ncm: string): TaxRates {
  // Tenta encontrar NCM exato
  if (NCM_TAX_RATES[ncm]) {
    return NCM_TAX_RATES[ncm];
  }
  
  // Tenta encontrar prefixo (ex: 870891 → 8708)
  const prefix = Object.keys(NCM_TAX_RATES).find(key => 
    key !== 'default' && ncm.startsWith(key)
  );
  
  if (prefix) {
    return NCM_TAX_RATES[prefix];
  }
  
  // Fallback padrão
  return NCM_TAX_RATES.default;
}

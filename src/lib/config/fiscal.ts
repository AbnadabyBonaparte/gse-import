// src/lib/config/fiscal.ts
// Configurações fiscais e de cálculo
// Futuro: buscar do Supabase (tabela settings ou fiscal_config)

/**
 * Taxa Siscomex fixa (em BRL)
 * Futuro: buscar do Supabase ou API da Receita Federal
 */
export const SISCOMEX_FEE = 115.67;

/**
 * Margem GSE (%)
 * Futuro: buscar do Supabase (configurável por organização)
 */
export const GSE_MARGIN = 20;

/**
 * Alíquota PIS/COFINS (%)
 * Futuro: buscar do Supabase ou API da Receita Federal
 */
export const PIS_COFINS_RATE = 9.25;

/**
 * Alíquota ICMS (%)
 * Futuro: buscar do Supabase ou API da Receita Federal
 * Nota: ICMS varia por estado, atualmente usando 18% padrão
 */
export const ICMS_RATE = 18;

/**
 * Estimativa de frete por país (em USD)
 * Futuro: buscar do Supabase ou calcular via API de frete
 */
export const FREIGHT_ESTIMATES: Record<string, number> = {
  'CN': 15, // China
  'US': 25, // Estados Unidos
  'JP': 20, // Japão
  'DE': 30, // Alemanha
  'KR': 18, // Coreia do Sul
  'default': 20 // Padrão
};

/**
 * Ajuste de frete por peso (USD por kg adicional acima de 1kg)
 * Futuro: buscar do Supabase ou calcular via API de frete
 */
export const FREIGHT_WEIGHT_ADJUSTMENT = 2.0;


// src/app/api/fiscal/calculate/route.ts
import { NextRequest } from 'next/server';
import { getTaxRates } from '@/lib/tax-rates';
import { getExchangeRate } from '@/lib/exchange-rate';
import {
  SISCOMEX_FEE,
  GSE_MARGIN,
  PIS_COFINS_RATE,
  ICMS_RATE,
  FREIGHT_ESTIMATES,
  FREIGHT_WEIGHT_ADJUSTMENT,
} from '@/lib/config/fiscal';

// Tipos para a requisição
interface FiscalCalculationRequest {
  price: number; // preço da peça
  currency: string; // "USD" ou outra
  weightKg: number; // peso estimado
  ncm: string; // do VisionResult
  originCountry: string; // ex: "CN", "US", "JP"
}

// Tipos para o retorno
interface BreakdownItem {
  label: string;
  value: number;
  percentage?: number; // Para mostrar alíquotas
}

interface FiscalCalculationResponse {
  breakdown: BreakdownItem[];
  totalGuaranteed: number;
  currency: "BRL";
  guaranteeNote: string;
}

// Função para estimar frete
function estimateFreight(country: string, weightKg: number): number {
  const baseFreight = FREIGHT_ESTIMATES[country] || FREIGHT_ESTIMATES.default;
  // Ajuste baseado no peso
  const weightAdjustment = weightKg > 1 ? (weightKg - 1) * FREIGHT_WEIGHT_ADJUSTMENT : 0;
  return baseFreight + weightAdjustment;
}

export async function POST(request: NextRequest) {
  try {
    const body: FiscalCalculationRequest = await request.json();
    
    // Validação básica
    if (!body.price || !body.currency || !body.weightKg || !body.ncm || !body.originCountry) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Obter taxa de câmbio (USD para BRL)
    // Nota: getExchangeRate é assíncrono e funciona no server-side
    const exchangeRate = await getExchangeRate(body.currency, 'BRL');
    
    // Converter preço para BRL
    const priceBRL = body.price * exchangeRate;
    
    // Estimar frete (em USD) e converter para BRL
    const freightUSD = estimateFreight(body.originCountry, body.weightKg);
    const freightBRL = freightUSD * exchangeRate;
    
    // Calcular valor aduaneiro
    const customsValue = priceBRL + freightBRL;
    
    // Obter alíquotas fiscais
    const taxRates = getTaxRates(body.ncm);
    
    // Calcular impostos
    const iiValue = (taxRates.ii / 100) * customsValue;
    const ipiBase = customsValue + iiValue;
    const ipiValue = (taxRates.ipi / 100) * ipiBase;
    
    // Calcular PIS/COFINS
    const pisCofinsBase = customsValue + iiValue;
    const pisCofinsValue = (PIS_COFINS_RATE / 100) * pisCofinsBase;
    
    // Calcular ICMS
    const icmsBase = customsValue + iiValue + ipiValue + pisCofinsValue;
    const icmsValue = (ICMS_RATE / 100) * icmsBase;
    
    // Calcular margem GSE
    const gseMarginBase = customsValue + iiValue + ipiValue + pisCofinsValue + icmsValue + SISCOMEX_FEE;
    const gseMarginValue = (GSE_MARGIN / 100) * gseMarginBase;
    
    // Calcular total garantido
    const totalGuaranteed = gseMarginBase + gseMarginValue;
    
    // Criar breakdown
    const breakdown: BreakdownItem[] = [
      { label: "Preço da peça", value: priceBRL },
      { label: "Frete estimado", value: freightBRL },
      { label: `II (${taxRates.ii}%)`, value: iiValue, percentage: taxRates.ii },
      { label: `IPI (${taxRates.ipi}%)`, value: ipiValue, percentage: taxRates.ipi },
      { label: `PIS/COFINS (${PIS_COFINS_RATE}%)`, value: pisCofinsValue },
      { label: `ICMS (${ICMS_RATE}%)`, value: icmsValue },
      { label: "Taxa Siscomex", value: SISCOMEX_FEE },
      { label: `Margem GSE (${GSE_MARGIN}%)`, value: gseMarginValue }
    ];
    
    // Resposta
    const response: FiscalCalculationResponse = {
      breakdown,
      totalGuaranteed,
      currency: "BRL",
      guaranteeNote: "GSE cobre a diferença se o imposto exceder o cálculo"
    };
    
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro no cálculo fiscal:', error);
    return new Response(
      JSON.stringify({ error: 'Erro no cálculo fiscal' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

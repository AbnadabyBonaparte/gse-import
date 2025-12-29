"""
Agente Fiscal - Cálculo de Impostos e Classificação NCM
GSE 1000 - Motor de cálculo tributário
"""

import os
from typing import Dict, Optional
from dataclasses import dataclass

@dataclass
class TaxBreakdown:
    """Detalhamento de impostos."""
    ncm_code: str
    part_price_usd: float
    part_price_brl: float
    exchange_rate: float
    ii_percentage: float  # Imposto de Importação
    ipi_percentage: float  # IPI
    pis_cofins_percentage: float
    icms_percentage: float
    total_tax_brl: float
    total_cost_brl: float
    shipping_brl: float


class FiscalAgent:
    """
    Agente que calcula impostos de importação.
    Classifica NCM e calcula todos os tributos aplicáveis.
    """
    
    def __init__(self):
        # Taxa de câmbio (deve vir de API em produção)
        self.default_exchange_rate = 5.20  # PTAX + 3%
        
        # Base de dados NCM (simplificada, deve vir de banco)
        self.ncm_database = {
            "water_pump": "8413.30.90",
            "radiator": "8708.91.00",
            "brake_pad": "8708.30.00",
            "oil_filter": "8421.23.00",
            "spark_plug": "8511.10.00"
        }
    
    def calculate_total_cost(
        self,
        part_name: str,
        part_price_usd: float,
        shipping_usd: float,
        exchange_rate: Optional[float] = None
    ) -> TaxBreakdown:
        """
        Calcula custo total incluindo todos os impostos.
        
        Args:
            part_name: Nome da peça
            part_price_usd: Preço da peça em USD
            shipping_usd: Frete em USD
            exchange_rate: Taxa de câmbio (opcional)
        
        Returns:
            TaxBreakdown com todos os cálculos
        """
        
        rate = exchange_rate or self.default_exchange_rate
        
        # Classificar NCM (simplificado, usar IA ou banco em produção)
        ncm_code = self._classify_ncm(part_name)
        
        # Converter para BRL
        part_price_brl = part_price_usd * rate
        shipping_brl = shipping_usd * rate
        
        # Calcular impostos
        # II (Imposto de Importação) - varia por NCM, média 20%
        ii_percentage = self._get_ii_rate(ncm_code)
        ii_value = part_price_brl * (ii_percentage / 100)
        
        # IPI (Imposto sobre Produtos Industrializados) - média 5%
        ipi_percentage = 5.0
        ipi_base = part_price_brl + ii_value
        ipi_value = ipi_base * (ipi_percentage / 100)
        
        # PIS/COFINS - 9.25% sobre valor aduaneiro
        pis_cofins_percentage = 9.25
        pis_cofins_base = part_price_brl + ii_value
        pis_cofins_value = pis_cofins_base * (pis_cofins_percentage / 100)
        
        # ICMS - 18% (varia por estado)
        icms_percentage = 18.0
        icms_base = part_price_brl + ii_value + ipi_value + pis_cofins_value
        icms_value = icms_base * (icms_percentage / (100 - icms_percentage))
        
        # Total de impostos
        total_tax_brl = ii_value + ipi_value + pis_cofins_value + icms_value
        
        # Custo total
        total_cost_brl = part_price_brl + shipping_brl + total_tax_brl
        
        return TaxBreakdown(
            ncm_code=ncm_code,
            part_price_usd=part_price_usd,
            part_price_brl=part_price_brl,
            exchange_rate=rate,
            ii_percentage=ii_percentage,
            ipi_percentage=ipi_percentage,
            pis_cofins_percentage=pis_cofins_percentage,
            icms_percentage=icms_percentage,
            total_tax_brl=total_tax_brl,
            total_cost_brl=total_cost_brl,
            shipping_brl=shipping_brl
        )
    
    def _classify_ncm(self, part_name: str) -> str:
        """
        Classifica NCM da peça.
        Em produção: usar GPT-4o ou banco de dados completo.
        """
        part_lower = part_name.lower()
        
        # Busca simples por palavras-chave
        for key, ncm in self.ncm_database.items():
            if key.replace("_", " ") in part_lower:
                return ncm
        
        # Default: NCM genérico para peças automotivas
        return "8708.99.90"
    
    def _get_ii_rate(self, ncm_code: str) -> float:
        """
        Retorna taxa de II para o NCM.
        Em produção: consultar base de dados da Receita Federal.
        """
        # Simplificado: maioria das peças automotivas tem II entre 18-25%
        return 20.0
    
    def generate_quote_pdf(self, breakdown: TaxBreakdown, part_name: str) -> str:
        """
        Gera PDF da cotação (retorna URL ou base64).
        Em produção: usar biblioteca de PDF (reportlab, weasyprint, etc.)
        """
        # TODO: Implementar geração de PDF
        return "quote_pdf_url_placeholder"


# Exemplo de uso
if __name__ == "__main__":
    fiscal = FiscalAgent()
    
    breakdown = fiscal.calculate_total_cost(
        part_name="water pump",
        part_price_usd=150.00,
        shipping_usd=50.00
    )
    
    print(f"NCM: {breakdown.ncm_code}")
    print(f"Preço peça: R$ {breakdown.part_price_brl:.2f}")
    print(f"Frete: R$ {breakdown.shipping_brl:.2f}")
    print(f"Impostos: R$ {breakdown.total_tax_brl:.2f}")
    print(f"TOTAL: R$ {breakdown.total_cost_brl:.2f}")




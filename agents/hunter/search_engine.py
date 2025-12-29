"""
Agente Hunter - Motor de Busca Global de Peças
GSE 1000 - Busca inteligente em múltiplos marketplaces
"""

import os
import requests
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class SearchResult:
    """Resultado de busca de peça."""
    title: str
    url: str
    price_usd: float
    shipping_usd: float
    marketplace: str
    seller_reputation: Optional[float] = None
    estimated_delivery_days: Optional[int] = None
    part_number: Optional[str] = None
    condition: Optional[str] = None  # new, used, refurbished


class HunterAgent:
    """
    Agente que busca peças em múltiplos marketplaces globais.
    Integra com Serper.dev, Apify, ou APIs nativas.
    """
    
    def __init__(self, serper_api_key: Optional[str] = None):
        self.serper_api_key = serper_api_key or os.getenv("SERPER_API_KEY")
        self.base_url = "https://google.serper.dev"
    
    def search_part(
        self, 
        part_name: str,
        car_model: Optional[str] = None,
        oem_code: Optional[str] = None,
        max_results: int = 10
    ) -> List[SearchResult]:
        """
        Busca peça em múltiplos marketplaces.
        
        Args:
            part_name: Nome da peça
            car_model: Modelo do carro (opcional)
            oem_code: Código OEM (opcional)
            max_results: Número máximo de resultados
        
        Returns:
            Lista de SearchResult ordenada por relevância/preço
        """
        
        # Construir query de busca
        query_parts = [part_name]
        if car_model:
            query_parts.append(car_model)
        if oem_code:
            query_parts.append(oem_code)
        
        query = " ".join(query_parts)
        
        # Adicionar sites específicos de peças automotivas
        site_restrictions = [
            "site:ebay.com",
            "site:rockauto.com",
            "site:amazon.com",
            "site:partsgeek.com"
        ]
        
        results = []
        
        # Buscar em cada marketplace
        for site in site_restrictions:
            site_results = self._search_serper(f"{query} {site}", max_results=3)
            results.extend(site_results)
        
        # Ordenar por relevância (preço + reputação + entrega)
        results = self._rank_results(results)
        
        return results[:max_results]
    
    def _search_serper(self, query: str, max_results: int = 3) -> List[SearchResult]:
        """Busca usando Serper.dev (Google Search API)."""
        
        if not self.serper_api_key:
            raise ValueError("SERPER_API_KEY não configurada")
        
        headers = {
            "X-API-KEY": self.serper_api_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "q": query,
            "num": max_results
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/search",
                headers=headers,
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            
            data = response.json()
            results = []
            
            # Parse dos resultados do Google
            for item in data.get("organic", []):
                result = SearchResult(
                    title=item.get("title", ""),
                    url=item.get("link", ""),
                    price_usd=self._extract_price(item.get("snippet", "")),
                    shipping_usd=0.0,  # Serper não fornece shipping direto
                    marketplace=self._extract_marketplace(item.get("link", "")),
                    seller_reputation=None,
                    estimated_delivery_days=None
                )
                results.append(result)
            
            return results
            
        except Exception as e:
            print(f"Erro na busca Serper: {e}")
            return []
    
    def _extract_price(self, snippet: str) -> float:
        """Extrai preço do snippet (básico, melhorar com regex mais sofisticado)."""
        import re
        # Procurar padrões como $99.99, US$100, etc
        price_patterns = [
            r'\$(\d+\.?\d*)',
            r'US\$(\d+\.?\d*)',
            r'USD\s*(\d+\.?\d*)'
        ]
        
        for pattern in price_patterns:
            match = re.search(pattern, snippet)
            if match:
                try:
                    return float(match.group(1))
                except:
                    continue
        
        return 0.0
    
    def _extract_marketplace(self, url: str) -> str:
        """Extrai marketplace da URL."""
        if "ebay.com" in url:
            return "ebay"
        elif "rockauto.com" in url:
            return "rockauto"
        elif "amazon.com" in url:
            return "amazon"
        elif "partsgeek.com" in url:
            return "partsgeek"
        else:
            return "other"
    
    def _rank_results(self, results: List[SearchResult]) -> List[SearchResult]:
        """
        Rankeia resultados por:
        - Preço total (peça + frete)
        - Reputação do vendedor
        - Prazo de entrega
        """
        # Ordenar por preço total (simplificado)
        return sorted(results, key=lambda x: x.price_usd + x.shipping_usd)


# Exemplo de uso
if __name__ == "__main__":
    hunter = HunterAgent()
    
    results = hunter.search_part(
        part_name="water pump",
        car_model="Golf GTI 2008",
        oem_code="06H121026"
    )
    
    for result in results:
        print(f"{result.title} - ${result.price_usd} - {result.marketplace}")


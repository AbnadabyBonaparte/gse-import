"""
Agente Concierge - Identificação de Peças via Vision AI
GSE 1000 - Módulo de identificação de peças automotivas
"""

import os
import base64
from typing import Dict, Optional
from openai import OpenAI

class VisionIdentifier:
    """
    Identifica peças automotivas usando GPT-4o Vision.
    Extrai: modelo do carro, tipo de peça, código OEM (se visível), VIN.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o"
    
    def identify_from_photo(self, photo_url: str, vin: Optional[str] = None) -> Dict:
        """
        Identifica peça a partir de foto.
        
        Args:
            photo_url: URL da foto ou base64
            vin: VIN do veículo (opcional, ajuda na identificação)
        
        Returns:
            Dict com:
            - part_name: Nome da peça
            - car_model: Modelo do carro
            - oem_code: Código OEM (se encontrado)
            - confidence: Confiança da identificação (0-100)
            - description: Descrição detalhada
        """
        
        system_prompt = """Você é um especialista em peças automotivas. 
Analise a foto fornecida e identifique:
1. Tipo de peça (ex: bomba d'água, radiador, freio, etc.)
2. Modelo do carro (se possível identificar)
3. Código OEM ou número de peça (se visível)
4. Condição da peça (nova, usada, danificada)
5. Compatibilidade aproximada

Responda em JSON estruturado com os campos acima."""
        
        user_prompt = f"""Analise esta foto de peça automotiva e identifique todos os detalhes possíveis.
{f'VIN do veículo: {vin}' if vin else ''}

Forneça:
- Nome exato da peça
- Modelo do carro compatível
- Código OEM/part number (se visível)
- Nível de confiança da identificação (0-100)
- Descrição detalhada"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": [
                        {"type": "text", "text": user_prompt},
                        {"type": "image_url", "image_url": {"url": photo_url}}
                    ]}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            # Parse da resposta (GPT-4o pode retornar JSON ou texto)
            content = response.choices[0].message.content
            
            # Tentar extrair JSON da resposta
            import json
            import re
            
            # Procurar JSON na resposta
            json_match = re.search(r'\{[^}]+\}', content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
            else:
                # Fallback: criar estrutura a partir do texto
                result = {
                    "part_name": self._extract_field(content, "peça", "nome"),
                    "car_model": self._extract_field(content, "modelo", "carro"),
                    "oem_code": self._extract_field(content, "código", "OEM"),
                    "confidence": self._extract_confidence(content),
                    "description": content[:200]
                }
            
            return {
                "success": True,
                "data": result,
                "raw_response": content
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": None
            }
    
    def identify_from_vin(self, vin: str) -> Dict:
        """
        Identifica informações do veículo a partir do VIN.
        Usa API da NHTSA ou similar.
        """
        # TODO: Implementar integração com NHTSA API
        # Por enquanto, retorna estrutura básica
        return {
            "success": True,
            "data": {
                "vin": vin,
                "make": None,
                "model": None,
                "year": None,
                "engine": None
            }
        }
    
    def _extract_field(self, text: str, *keywords) -> Optional[str]:
        """Extrai campo do texto usando palavras-chave."""
        text_lower = text.lower()
        for keyword in keywords:
            if keyword in text_lower:
                # Tentar extrair valor após a palavra-chave
                idx = text_lower.find(keyword)
                snippet = text[idx:idx+100]
                # Lógica simples de extração
                return snippet.split(':')[-1].strip()[:50]
        return None
    
    def _extract_confidence(self, text: str) -> int:
        """Extrai nível de confiança (0-100) do texto."""
        import re
        # Procurar números que parecem porcentagem
        matches = re.findall(r'(\d+)%', text)
        if matches:
            return int(matches[0])
        # Procurar números entre 0-100
        matches = re.findall(r'\b([0-9]|[1-9][0-9]|100)\b', text)
        if matches:
            return min(int(matches[0]), 100)
        return 50  # Default


# Exemplo de uso
if __name__ == "__main__":
    identifier = VisionIdentifier()
    
    # Teste com URL de foto
    result = identifier.identify_from_photo(
        photo_url="https://example.com/part-photo.jpg",
        vin="WVWZZZ1KZAW123456"
    )
    
    print(result)




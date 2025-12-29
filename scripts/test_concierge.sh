#!/bin/bash

# GSE 1000 - Script de Teste do Agente Concierge
# Bash Script para testar o webhook de identificação de peças

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ $# -lt 2 ]; then
    echo -e "${RED}Uso: $0 <webhook_url> <image_url> [vin] [car_model]${NC}"
    echo ""
    echo "Exemplos:"
    echo "  $0 https://seu-n8n.com/webhook/concierge-identify https://example.com/part.jpg"
    echo "  $0 https://seu-n8n.com/webhook/concierge-identify https://example.com/part.jpg \"WVWZZZ1KZAW123456\" \"Golf GTI 2015\""
    exit 1
fi

WEBHOOK_URL=$1
IMAGE_URL=$2
VIN=${3:-""}
CAR_MODEL=${4:-""}

echo -e "${GREEN}🏎️ GSE Import - Teste do Agente Concierge${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Preparar payload JSON
JSON_BODY="{"
JSON_BODY+="\"imageUrl\":\"$IMAGE_URL\""

if [ -n "$VIN" ]; then
    JSON_BODY+=",\"vin\":\"$VIN\""
fi

if [ -n "$CAR_MODEL" ]; then
    JSON_BODY+=",\"carModel\":\"$CAR_MODEL\""
fi

JSON_BODY+="}"

echo -e "${YELLOW}📤 Enviando requisição...${NC}"
echo -e "${GRAY}   Webhook: $WEBHOOK_URL${NC}"
echo -e "${GRAY}   Imagem: $IMAGE_URL${NC}"
[ -n "$VIN" ] && echo -e "${GRAY}   VIN: $VIN${NC}"
[ -n "$CAR_MODEL" ] && echo -e "${GRAY}   Modelo: $CAR_MODEL${NC}"
echo ""

# Fazer requisição
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "$JSON_BODY")

# Separar resposta e código HTTP
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

# Verificar código HTTP
if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
    echo -e "${GREEN}✅ Resposta recebida (HTTP $HTTP_CODE):${NC}"
    echo ""
    
    # Tentar parsear JSON (se jq estiver instalado)
    if command -v jq &> /dev/null; then
        SUCCESS=$(echo "$BODY" | jq -r '.success // false')
        if [ "$SUCCESS" = "true" ]; then
            echo -e "${CYAN}Identificação:${NC}"
            echo "$BODY" | jq -r '.identification' | sed 's/^/   /'
            echo ""
            echo -e "${GRAY}Timestamp: $(echo "$BODY" | jq -r '.timestamp')${NC}"
        else
            echo -e "${RED}❌ Erro na identificação${NC}"
            echo "$BODY" | jq '.'
        fi
    else
        # Sem jq, mostrar resposta bruta
        echo "$BODY"
    fi
else
    echo -e "${RED}❌ Erro na requisição (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi

echo ""
echo -e "${GREEN}Teste concluído!${NC}"


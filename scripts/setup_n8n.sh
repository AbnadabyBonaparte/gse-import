#!/bin/bash

# Script de Setup do n8n para GSE 1000
# Execute: chmod +x scripts/setup_n8n.sh && ./scripts/setup_n8n.sh

echo "🚀 GSE 1000 - Setup do n8n"
echo "=========================="

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Instale Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env a partir do .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais antes de continuar!"
    read -p "Pressione Enter após editar o .env..."
fi

# Criar diretórios necessários
echo "📁 Criando estrutura de diretórios..."
mkdir -p infrastructure/n8n/workflows
mkdir -p infrastructure/n8n/credentials

# Iniciar containers
echo "🐳 Iniciando containers Docker..."
docker-compose up -d

echo ""
echo "✅ Setup concluído!"
echo ""
echo "🌐 n8n está rodando em: http://localhost:5678"
echo "👤 Usuário padrão: admin"
echo "🔑 Senha: (verifique no arquivo .env)"
echo ""
echo "📚 Próximos passos:"
echo "   1. Acesse http://localhost:5678"
echo "   2. Importe os workflows de infrastructure/n8n/workflows/"
echo "   3. Configure as credenciais no n8n"
echo ""



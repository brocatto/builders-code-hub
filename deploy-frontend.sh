#!/bin/bash

# Script de Deploy Frontend - Builder's Code Hub
# Execute este script após o backend estar deployado

echo "🚀 Builder's Code Hub - Deploy Frontend"
echo "======================================="

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Função para verificar URL
check_url() {
    local url=$1
    local name=$2
    echo "🔍 Verificando $name: $url"
    
    if curl -f -s "$url/api/status" > /dev/null 2>&1; then
        echo "✅ $name está online!"
        return 0
    else
        echo "❌ $name não está respondendo"
        return 1
    fi
}

# Solicitar URL do backend
echo ""
echo "📝 Configuração necessária:"
read -p "Digite a URL do backend em produção (ex: https://backend.vercel.app): " BACKEND_URL

if [[ -z "$BACKEND_URL" ]]; then
    echo "❌ URL do backend é obrigatória"
    exit 1
fi

# Verificar se o backend está online
check_url "$BACKEND_URL" "Backend API"
if [[ $? -ne 0 ]]; then
    echo "⚠️  Backend não está respondendo. Continuando mesmo assim..."
fi

echo ""
echo "🔧 Configurando variáveis de ambiente..."

# Deploy CMS Frontend
echo ""
echo "📱 Deployando CMS Frontend..."
cd builders-code-cms-frontend

# Configurar variáveis de ambiente via Vercel CLI
echo "Configurando variáveis para CMS Frontend..."
vercel env add VITE_API_URL production "$BACKEND_URL"
vercel env add NODE_ENV production "production"

# Deploy
echo "Fazendo deploy do CMS Frontend..."
vercel deploy --prod

if [[ $? -eq 0 ]]; then
    echo "✅ CMS Frontend deployado com sucesso!"
else
    echo "❌ Erro no deploy do CMS Frontend"
    exit 1
fi

# Deploy Website Público
echo ""
echo "🌐 Deployando Website Público..."
cd ../builders-code-v3

# Configurar variáveis de ambiente via Vercel CLI
echo "Configurando variáveis para Website Público..."
vercel env add REACT_APP_API_URL production "${BACKEND_URL}/api"
vercel env add REACT_APP_ENV production "production"

# Deploy
echo "Fazendo deploy do Website Público..."
vercel deploy --prod

if [[ $? -eq 0 ]]; then
    echo "✅ Website Público deployado com sucesso!"
else
    echo "❌ Erro no deploy do Website Público"
    exit 1
fi

echo ""
echo "🎉 Deploy concluído!"
echo "======================================"
echo "📱 CMS Admin: Verifique a URL no output do Vercel"
echo "🌐 Website Público: Verifique a URL no output do Vercel"
echo ""
echo "🔧 Próximos passos:"
echo "1. Testar login no CMS"
echo "2. Criar/editar conteúdo"
echo "3. Verificar mudanças no website público"
echo "4. Validar responsividade"
echo ""
echo "📞 Em caso de problemas:"
echo "- Verificar logs: vercel logs [deployment-url]"
echo "- Verificar variáveis: vercel env ls"
echo "- Redeployar: vercel deploy --prod"
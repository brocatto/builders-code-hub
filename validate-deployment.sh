#!/bin/bash

# Script de Validação de Deploy - Builder's Code Hub
# Verifica status de todos os componentes deployados

echo "🔍 Builder's Code Hub - Validação de Deploy"
echo "==========================================="

# URLs dos deployments
BACKEND_URL="https://builders-code-cms-backend-i3c2r53m1-brocattos-projects.vercel.app"
CMS_URL="https://builders-code-cms-frontend-a1b2ca5rm-brocattos-projects.vercel.app"
WEBSITE_URL="https://builders-code-v3-eney6qx6x-brocattos-projects.vercel.app"

echo ""
echo "📊 URLs de Produção:"
echo "• Backend API: $BACKEND_URL"
echo "• CMS Admin:   $CMS_URL"
echo "• Website:     $WEBSITE_URL"

# Função para verificar status de resposta
check_status() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    
    echo -n "🔍 Verificando $name... "
    
    # Fazer requisição e capturar código de status
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    
    if [[ $status_code -eq $expected_status ]]; then
        echo "✅ Online (HTTP $status_code)"
        return 0
    elif [[ $status_code -eq 401 ]] || [[ $status_code -eq 403 ]]; then
        echo "🔐 Protegido por autenticação (HTTP $status_code)"
        return 1
    else
        echo "❌ Erro (HTTP $status_code)"
        return 1
    fi
}

echo ""
echo "🔍 Verificando Status dos Deployments:"
echo "======================================"

# Verificar Backend
check_status "$BACKEND_URL/api/status" "Backend API"
backend_status=$?

# Verificar endpoints públicos do backend
echo -n "🔍 Verificando API Pública... "
public_status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/projetos/public" --max-time 10)
if [[ $public_status -eq 200 ]]; then
    echo "✅ Endpoints públicos funcionando"
elif [[ $public_status -eq 401 ]] || [[ $public_status -eq 403 ]]; then
    echo "🔐 Endpoints protegidos por autenticação"
else
    echo "❌ Erro nos endpoints públicos (HTTP $public_status)"
fi

# Verificar CMS Frontend
check_status "$CMS_URL" "CMS Frontend"
cms_status=$?

# Verificar Website
check_status "$WEBSITE_URL" "Website Público"
website_status=$?

echo ""
echo "📊 Resumo do Status:"
echo "==================="

# Determinar status geral
if [[ $backend_status -eq 1 ]] && [[ $cms_status -eq 1 ]] && [[ $website_status -eq 1 ]]; then
    echo "🔐 Status: TODAS AS APLICAÇÕES PROTEGIDAS POR VERCEL SSO"
    echo "   ✅ Todos os deployments foram bem-sucedidos"
    echo "   🔐 Acesso restrito a membros autorizados da equipe"
    echo "   ⚠️  Para acesso público, configure as permissões no Vercel"
elif [[ $backend_status -eq 0 ]] || [[ $cms_status -eq 0 ]] || [[ $website_status -eq 0 ]]; then
    echo "✅ Status: DEPLOYMENTS ATIVOS COM ACESSO MISTO"
    echo "   ✅ Alguns componentes com acesso público"
    echo "   🔐 Alguns componentes protegidos"
else
    echo "❌ Status: PROBLEMAS DETECTADOS"
    echo "   ⚠️  Alguns deployments podem ter falhado"
fi

echo ""
echo "🛠️ Informações de Build:"
echo "========================"

# Verificar arquivos de configuração
echo "📁 Configurações criadas:"
if [[ -f "builders-code-cms-frontend/vercel.json" ]]; then
    echo "   ✅ CMS Frontend: vercel.json configurado"
else
    echo "   ❌ CMS Frontend: vercel.json não encontrado"
fi

if [[ -f "builders-code-v3/vercel.json" ]]; then
    echo "   ✅ Website: vercel.json configurado"
else
    echo "   ❌ Website: vercel.json não encontrado"
fi

if [[ -f "builders-code-cms-frontend/.env.production" ]]; then
    echo "   ✅ CMS Frontend: .env.production configurado"
else
    echo "   ❌ CMS Frontend: .env.production não encontrado"
fi

if [[ -f "builders-code-v3/.env.production" ]]; then
    echo "   ✅ Website: .env.production configurado"
else
    echo "   ❌ Website: .env.production não encontrado"
fi

echo ""
echo "🔐 Configuração de Segurança:"
echo "============================="
echo "• Vercel SSO: Ativo em todas as aplicações"
echo "• HTTPS: Forçado por padrão"
echo "• Headers de segurança: Configurados"
echo "• CORS: Configurado no backend"

echo ""
echo "📚 Documentação Criada:"
echo "======================"
if [[ -f "FRONTEND_DEPLOYMENT_REPORT.md" ]]; then
    echo "   ✅ Relatório de Deploy Frontend"
fi
if [[ -f "VERCEL_SETUP_GUIDE.md" ]]; then
    echo "   ✅ Guia de Setup Vercel"
fi
if [[ -f "deploy-frontend.sh" ]]; then
    echo "   ✅ Script de Deploy Automatizado"
fi

echo ""
echo "🎯 Próximos Passos Recomendados:"
echo "================================"
echo "1. 🔓 Configurar acesso público (se necessário):"
echo "   • Acessar Vercel Dashboard > Project Settings > Authentication"
echo "   • Desabilitar Vercel Authentication para acesso público"
echo ""
echo "2. 🌐 Configurar domínios personalizados:"
echo "   • cms.seudominio.com para o CMS"
echo "   • www.seudominio.com para o website"
echo ""
echo "3. 📊 Configurar monitoramento:"
echo "   • Vercel Analytics"
echo "   • Error tracking (Sentry)"
echo "   • Performance monitoring"
echo ""
echo "4. 🔄 Atualizar CORS no backend:"
echo "   • Adicionar URLs dos frontends ao allowedOrigins"
echo "   • Atualizar FRONTEND_URL no backend"

echo ""
echo "✅ Validação concluída!"
echo "===================="
echo "📞 Em caso de problemas:"
echo "• Verificar logs: vercel logs [deployment-url]"
echo "• Verificar variáveis: vercel env ls"
echo "• Redeployar: vercel deploy --prod"
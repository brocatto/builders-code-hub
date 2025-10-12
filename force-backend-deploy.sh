#!/bin/bash

echo "======================================"
echo "🚀 FORÇANDO REDEPLOY DO BACKEND"
echo "======================================"
echo ""

# Verificar se está no diretório correto
if [ ! -d "builders-code-cms-backend" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto builders-code-hub"
    exit 1
fi

echo "📝 Criando commit vazio para forçar redeploy..."
git commit --allow-empty -m "chore: Force backend redeploy to fix ENOENT error

This empty commit triggers a redeploy on Vercel to apply the critical
fix that removes the frontend serving logic from the backend.

Related commits:
- 3d766fb: Remove frontend serving logic
- 85bbe3a: Add custom domain CORS support
- d4fdaaf: Add fallback URLs

Issue: Backend still serving old code with index.html error"

echo ""
echo "📤 Enviando para GitHub..."
git push origin main

echo ""
echo "✅ Commit enviado! Agora aguarde 1-2 minutos."
echo ""
echo "======================================"
echo "📋 VERIFICAÇÃO"
echo "======================================"
echo ""
echo "1. Acesse: https://vercel.com/dashboard"
echo "2. Entre no projeto 'builders-code-cms-backend'"
echo "3. Vá em 'Deployments' e veja se um novo deploy está em andamento"
echo ""
echo "Se o deploy NÃO iniciar automaticamente:"
echo "  - O projeto pode não estar conectado ao GitHub"
echo "  - Veja as instruções abaixo para deploy manual"
echo ""
echo "======================================"
echo "🧪 TESTE (após deploy completar)"
echo "======================================"
echo ""
echo "curl https://builders-code-cms-backend-i3c2r53m1-brocattos-projects.vercel.app/api/logs/public"
echo ""
echo "Deve retornar JSON (não erro ENOENT)"
echo ""

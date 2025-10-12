# Guia de Setup Vercel - Builder's Code Hub Frontend

## 🎯 Visão Geral

Este guia explica como fazer deploy dos frontends (CMS Admin + Website Público) na Vercel após o backend estar deployado.

## 📋 Pré-requisitos

1. ✅ Backend deployado (pelo AGENTE 3)
2. ✅ URL do backend em produção
3. ✅ Conta na Vercel
4. ✅ Repositório Git conectado

## 🚀 Deploy via Interface Web Vercel

### 1. CMS Frontend (Admin Panel)

#### Configuração do Projeto:
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Variáveis de Ambiente:
```
VITE_API_URL = https://seu-backend.vercel.app
NODE_ENV = production
```

#### Configurações Especiais:
- ✅ `vercel.json` já configurado (SPA routing)
- ✅ Redirects para `/index.html`
- ✅ Headers de segurança

### 2. Website Público (builders-code-v3)

#### Configuração do Projeto:
```
Framework Preset: Create React App
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

#### Variáveis de Ambiente:
```
REACT_APP_API_URL = https://seu-backend.vercel.app/api
REACT_APP_ENV = production
```

#### Configurações Especiais:
- ✅ `vercel.json` já configurado
- ✅ Cache otimizado para assets estáticos
- ✅ Headers de segurança

## 🛠️ Deploy via CLI

### Instalação do Vercel CLI:
```bash
npm install -g vercel
vercel login
```

### Deploy Automatizado:
```bash
./deploy-frontend.sh
```

### Deploy Manual:

#### CMS Frontend:
```bash
cd builders-code-cms-frontend
vercel env add VITE_API_URL production "https://seu-backend.vercel.app"
vercel env add NODE_ENV production "production"
vercel deploy --prod
```

#### Website Público:
```bash
cd builders-code-v3
vercel env add REACT_APP_API_URL production "https://seu-backend.vercel.app/api"
vercel env add REACT_APP_ENV production "production"
vercel deploy --prod
```

## 🔧 Configuração de Domínio (Opcional)

### Domínios Sugeridos:
- **CMS Admin:** `cms.seudominio.com`
- **Website Público:** `www.seudominio.com` ou `seudominio.com`

### Configuração:
1. Vá para Settings > Domains no Vercel
2. Adicione o domínio personalizado
3. Configure DNS (A/CNAME records)
4. Aguarde propagação (até 24h)

## 🧪 Testes Pós-Deploy

### Checklist de Validação:

#### CMS Admin:
- [ ] ✅ Login funciona
- [ ] ✅ Dashboard carrega
- [ ] ✅ CRUD de projetos funciona
- [ ] ✅ CRUD de logs funciona
- [ ] ✅ CRUD de ideias funciona
- [ ] ✅ Upload de mídia funciona
- [ ] ✅ Responsividade OK

#### Website Público:
- [ ] ✅ Homepage carrega
- [ ] ✅ Projetos são exibidos
- [ ] ✅ Logs são exibidos
- [ ] ✅ Ideias são exibidas
- [ ] ✅ Navegação funciona
- [ ] ✅ Responsividade OK

### Teste de Integração:
1. 🔐 Faça login no CMS
2. ✏️ Edite um projeto existente
3. 🔄 Recarregue o website público
4. ✅ Verifique se as mudanças aparecem

## 🐛 Troubleshooting

### Problemas Comuns:

#### CORS Errors:
```
❌ Access to fetch at 'api-url' from origin 'frontend-url' has been blocked
```
**Solução:** Verificar se FRONTEND_URL está configurado no backend

#### 404 em Rotas SPA:
```
❌ Cannot GET /admin/projetos
```
**Solução:** Verificar se vercel.json está configurado corretamente

#### API Not Found:
```
❌ GET https://frontend.vercel.app/api/projetos 404
```
**Solução:** API deve apontar para o backend, não frontend

#### Build Failures:
```
❌ Module not found: Can't resolve...
```
**Solução:** 
- Verificar dependências: `npm install`
- Limpar cache: `npm run build` novamente

### Debug Commands:
```bash
# Verificar logs de deployment
vercel logs [deployment-url]

# Verificar variáveis de ambiente
vercel env ls

# Verificar status do build
vercel inspect [deployment-url]

# Redeployar em caso de problemas
vercel deploy --prod --force
```

## 📊 Monitoramento

### Métricas Importantes:
- **Performance:** Core Web Vitals
- **Uptime:** Status checks automáticos
- **Errors:** Error tracking via logs
- **Usage:** Analytics do Vercel

### Configuração de Alerts:
1. Vercel Dashboard > Monitoring
2. Configure alerts para downtime
3. Configure alerts para performance

## 🔒 Segurança

### Headers Configurados:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Outras Configurações:
- HTTPS forçado por padrão
- Cache otimizado para assets
- Compressão Gzip automática

## 📱 URLs Finais

Após o deploy, você terá:

### Desenvolvimento:
- **CMS Admin:** http://localhost:5173
- **Website:** http://localhost:3000
- **API:** http://localhost:5000

### Produção:
- **CMS Admin:** https://cms-frontend-hash.vercel.app
- **Website:** https://website-hash.vercel.app
- **API:** https://backend-hash.vercel.app

## 🎯 Próximos Passos

1. **Domínio Personalizado:** Configure domínios próprios
2. **CDN:** Vercel já inclui CDN global
3. **Analytics:** Configure Vercel Analytics
4. **Monitoring:** Configure alertas e monitoramento
5. **CI/CD:** Configure GitHub Actions (opcional)

## 📞 Suporte

### Em caso de problemas:
1. **Logs:** Sempre verificar logs primeiro
2. **Documentação:** [docs.vercel.com](https://vercel.com/docs)
3. **Community:** Vercel Discord/GitHub
4. **Status:** [status.vercel.com](https://status.vercel.com)

---

## 🚀 Quick Deploy Commands

```bash
# Clone + Setup + Deploy
git clone [repo]
cd builders-code-hub
./deploy-frontend.sh

# Ou deploy manual:
cd builders-code-cms-frontend && vercel deploy --prod
cd ../builders-code-v3 && vercel deploy --prod
```

**Importante:** Sempre aguarde o backend estar online antes de fazer deploy dos frontends!
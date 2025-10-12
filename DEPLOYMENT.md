# Builder's Code Hub - Guia de Deployment

## 📋 Visão Geral

Este documento contém as instruções completas para deployment em produção do ecossistema Builder's Code Hub, composto por 3 aplicações:

- **Backend API** (Node.js/Express + MongoDB)
- **CMS Frontend** (React + Vite)
- **Website Público** (React + Create React App)

## 🏗️ Arquitetura de Produção

```
Internet
    │
    ├── Frontend Apps (Static Hosting)
    │   ├── Website Público (Vercel/Netlify)
    │   └── CMS Admin (Vercel/Netlify)
    │
    └── Backend API (Cloud Platform)
        ├── Node.js/Express (Vercel/Railway/Heroku)
        └── MongoDB Atlas (Database)
```

## 🚀 Deployment Recomendado

### 1. Backend API (Vercel)

**Configuração no Vercel:**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Variáveis de Ambiente Necessárias:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_COOKIE_EXPIRES_IN=24
FRONTEND_URL=https://cms-admin.seu-dominio.com
```

### 2. CMS Frontend (Vercel/Netlify)

**Build Commands:**
```bash
npm run build
```

**Variáveis de Ambiente:**
```
VITE_API_URL=https://api.seu-dominio.com
NODE_ENV=production
```

**Configuração de Redirects (_redirects para Netlify):**
```
/*    /index.html   200
```

### 3. Website Público (Vercel/Netlify)

**Build Commands:**
```bash
npm run build
```

**Variáveis de Ambiente:**
```
REACT_APP_API_URL=https://api.seu-dominio.com/api
REACT_APP_ENV=production
```

## 🛠️ Setup Local para Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- MongoDB (local ou Atlas)

### Instalação Rápida
```bash
# Clone o repositório
git clone <repository-url>
cd builders-code-hub

# Execute o script de inicialização
./start-ecosystem.sh

# Ou inicie manualmente cada aplicação:

# 1. Backend
cd builders-code-cms-backend
npm install
npm run dev

# 2. CMS Frontend  
cd ../builders-code-cms-frontend
npm install
npm run dev

# 3. Website Público
cd ../builders-code-v3
npm install
npm start
```

### URLs de Desenvolvimento
- **Backend API:** http://localhost:5000
- **CMS Admin:** http://localhost:5173
- **Website Público:** http://localhost:3000

### Credenciais Admin Padrão
- **Email:** admin@builderhub.com
- **Senha:** admin123

## 🔧 Configuração de Ambiente

### Desenvolvimento (.env files)

**builders-code-cms-backend/.env:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=development-secret-key
JWT_EXPIRES_IN=24h
JWT_COOKIE_EXPIRES_IN=24
FRONTEND_URL=http://localhost:5173
```

**builders-code-cms-frontend/.env:**
```env
VITE_API_URL=http://localhost:5000
NODE_ENV=development
```

**builders-code-v3/.env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Produção

**Backend (Vercel Environment Variables):**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secret-production-key
FRONTEND_URL=https://cms.yourdomain.com
```

**CMS Frontend:**
```
VITE_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

**Website Público:**
```
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
```

## 📊 Monitoramento

### Health Checks
- **Backend:** `GET /api/status`
- **Frontend Apps:** Verificar se carregam corretamente

### Logs
```bash
# Verificar logs em desenvolvimento
tail -f logs/*.log

# Em produção (Vercel)
vercel logs [deployment-url]
```

## 🔒 Segurança

### Checklist de Segurança
- [ ] JWT secrets únicos e seguros
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativado
- [ ] Helmet.js configurado
- [ ] XSS protection ativado
- [ ] HTTPS em produção
- [ ] Variáveis sensíveis em environment variables
- [ ] Admin password alterado

### CORS em Produção
```javascript
const allowedOrigins = [
  'https://website.yourdomain.com',
  'https://cms.yourdomain.com',
  process.env.FRONTEND_URL
].filter(Boolean);
```

## 🗄️ Database

### MongoDB Atlas Setup
1. Criar cluster no MongoDB Atlas
2. Configurar IP whitelist (0.0.0.0/0 para Vercel)
3. Criar usuário com permissões adequadas
4. Obter connection string
5. Configurar em variáveis de ambiente

### Backup Strategy
- MongoDB Atlas automático
- Exports periódicos para segurança

## 🚢 CI/CD

### GitHub Actions Exemplo
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./builders-code-cms-backend
```

## 🐛 Troubleshooting

### Problemas Comuns

**1. CORS Errors:**
- Verificar allowedOrigins no backend
- Confirmar URLs corretas nas variáveis de ambiente

**2. MongoDB Connection:**
- Verificar connection string
- Confirmar IP whitelist
- Testar conectividade

**3. JWT Issues:**
- Verificar JWT_SECRET
- Confirmar cookies/headers
- Verificar expiração

**4. Build Failures:**
- Verificar versões do Node.js
- Confirmar dependências instaladas
- Verificar variáveis de ambiente

### Debug Commands
```bash
# Verificar status do ecossistema
./status-ecosystem.sh

# Verificar logs
tail -f logs/*.log

# Testar endpoints
curl http://localhost:5000/api/status
curl http://localhost:5000/api/projetos/public
```

## 📈 Performance

### Otimizações Recomendadas
- **CDN** para assets estáticos
- **Image optimization** para uploads
- **Database indexing** para queries
- **Caching** com Redis (opcional)
- **Compression** middleware

### Métricas a Monitorar
- Response time da API
- Database query performance
- Frontend bundle size
- User engagement

## 🔄 Backup e Recovery

### Estratégia de Backup
1. **Database:** MongoDB Atlas automated backups
2. **Code:** Git repository backups
3. **Environment:** Document all configurations
4. **Media:** Regular export of uploaded files

### Recovery Plan
1. Restore database from backup
2. Redeploy applications
3. Restore environment variables
4. Test functionality
5. Update DNS if needed

## 📞 Support

### Recursos de Ajuda
- **Logs:** Verificar logs detalhados
- **Monitoring:** Setup alerts para downtime
- **Documentation:** Manter docs atualizadas
- **Team Access:** Compartilhar credenciais seguramente

---

## 🎯 Quick Reference

### Comandos Essenciais
```bash
# Desenvolvimento
./start-ecosystem.sh     # Iniciar tudo
./stop-ecosystem.sh      # Parar tudo
./status-ecosystem.sh    # Status

# Produção
npm run build           # Build para produção
vercel deploy          # Deploy Vercel
netlify deploy         # Deploy Netlify
```

### URLs Importantes
- **Desenvolvimento:** http://localhost:3000, http://localhost:5173, http://localhost:5000
- **Produção:** Configurar conforme domínios

### Credenciais Padrão
- **Admin:** admin@builderhub.com / admin123
- **Alterar imediatamente em produção!**
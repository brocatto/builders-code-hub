# Instruções para Corrigir o Erro de CORS no Domínio Personalizado

## Problema Identificado

Após adicionar o domínio personalizado `https://www.builderscode.com.br` no Vercel, o frontend não consegue mais se comunicar com o backend devido a bloqueio de CORS.

**Erro exibido**: "Network error: Unable to connect to server"

## Causa Raiz

O backend está configurado para aceitar apenas origens específicas. O novo domínio personalizado não estava na lista de origens permitidas.

## Solução Implementada

### 1. Atualização do CORS no Backend ✅

Arquivo: `builders-code-cms-backend/src/app.js`

Adicionadas as seguintes origens ao array `allowedOrigins`:
- `https://www.builderscode.com.br`
- `https://builderscode.com.br`

### 2. Configuração de Variáveis de Ambiente no Vercel

#### Backend (builders-code-cms-backend)

No dashboard do Vercel, configure as seguintes variáveis de ambiente:

```env
FRONTEND_URL=https://www.builderscode.com.br
NODE_ENV=production
MONGODB_URI=<sua-mongodb-uri>
JWT_SECRET=<seu-jwt-secret>
```

#### Frontend V3 (builders-code-v3)

No dashboard do Vercel, configure:

```env
REACT_APP_API_URL=<URL_DO_BACKEND>/api
REACT_APP_ENV=production
```

**Nota**: Substitua `<URL_DO_BACKEND>` pela URL do backend no Vercel. Para encontrá-la:
1. Acesse o dashboard do Vercel
2. Entre no projeto `builders-code-cms-backend`
3. Vá em "Deployments" e copie a URL do último deploy bem-sucedido
4. Exemplo: `https://builders-code-cms-backend-xxxxx.vercel.app`

#### CMS Frontend (builders-code-cms-frontend)

No dashboard do Vercel, configure:

```env
VITE_API_URL=<URL_DO_BACKEND>
NODE_ENV=production
```

### 3. URLs do Backend - Inconsistências Encontradas

Foram identificadas URLs diferentes do backend em diferentes arquivos:

- `.env.production`: `https://builders-code-cms-backend-i3c2r53m1-brocattos-projects.vercel.app`
- Código hardcoded: `https://builders-code-cms-backend-9g0zqfie6-brocattos-projects.vercel.app`

**Ação necessária**: Verificar qual é a URL correta atual do backend e atualizar as variáveis de ambiente no Vercel.

## Passos para Aplicar a Correção

### 1. Commit e Push das Mudanças do Backend

```bash
cd builders-code-cms-backend
git add src/app.js
git commit -m "fix: Add custom domain to CORS allowed origins"
git push
```

O Vercel fará o redeploy automático do backend.

### 2. Configurar Variáveis de Ambiente no Vercel

1. Acesse https://vercel.com/dashboard
2. Para cada projeto (backend e frontends), vá em "Settings" → "Environment Variables"
3. Adicione/atualize as variáveis mencionadas acima
4. Clique em "Save"
5. Force um redeploy em "Deployments" → "..." → "Redeploy"

### 3. Verificar a Correção

Após o redeploy:
1. Acesse `https://www.builderscode.com.br`
2. Verifique se os projetos, logs e ideias aparecem corretamente
3. Abra o Console do navegador (F12) e verifique se não há erros de CORS

## Verificação de URL do Backend

Para descobrir a URL correta do backend:

```bash
# No terminal
cd builders-code-cms-backend
vercel ls
```

Ou verifique no dashboard do Vercel na seção "Deployments" do projeto backend.

## Configuração Opcional: Domínio Personalizado para Backend

Se quiser um domínio personalizado também para o backend (ex: `api.builderscode.com.br`):

1. No Vercel, vá no projeto `builders-code-cms-backend`
2. Settings → Domains
3. Adicione `api.builderscode.com.br`
4. Configure o DNS conforme instruções do Vercel
5. Atualize as variáveis `REACT_APP_API_URL` e `VITE_API_URL` nos frontends para usar `https://api.builderscode.com.br`

## Troubleshooting

### Erro persiste após mudanças

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Verifique se o redeploy foi concluído no Vercel
3. Verifique as variáveis de ambiente no dashboard do Vercel
4. Teste a URL do backend diretamente: `https://<backend-url>/api/status`

### Como testar o backend

```bash
curl https://<backend-url>/api/status
```

Deve retornar:
```json
{
  "status": "success",
  "message": "API do Builder's Code CMS está funcionando!",
  "timestamp": "..."
}
```

### Verificar CORS no navegador

1. Abra o Console (F12)
2. Vá na aba "Network"
3. Recarregue a página
4. Procure por requisições para o backend
5. Se houver erro de CORS, verá mensagem similar a: "Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy"

## Arquivos Modificados

- `builders-code-cms-backend/src/app.js` - Adicionados domínios personalizados ao CORS

## Próximos Passos Recomendados

1. Atualizar o código hardcoded para usar apenas variáveis de ambiente (sem fallbacks)
2. Criar um único arquivo de configuração centralizado para URLs
3. Adicionar testes automatizados para verificar conectividade da API
4. Documentar o processo de deploy completo

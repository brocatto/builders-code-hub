#!/bin/bash

# Builder's Code Hub - Script de Inicialização do Ecossistema Completo
# Este script inicia todas as 3 aplicações do ecossistema

echo "🚀 Iniciando Builder's Code Hub Ecossistema..."
echo "================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se porta está em uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Função para aguardar que serviço esteja disponível
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -n "Aguardando $name estar disponível"
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo -e " ${RED}✗${NC}"
    return 1
}

# Verificar dependências
echo -e "${BLUE}1. Verificando dependências...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não encontrado. Instale Node.js primeiro.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm não encontrado. Instale npm primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

# Verificar se dependências estão instaladas
echo -e "${BLUE}2. Verificando dependências do projeto...${NC}"

for dir in "builders-code-cms-backend" "builders-code-cms-frontend" "builders-code-v3"; do
    if [ ! -d "$dir/node_modules" ]; then
        echo -e "${YELLOW}⚠ Instalando dependências em $dir...${NC}"
        cd "$dir"
        npm install
        cd ..
    else
        echo -e "${GREEN}✓ Dependências em $dir OK${NC}"
    fi
done

# Parar processos existentes se estiverem rodando
echo -e "${BLUE}3. Limpando processos existentes...${NC}"

# Matar processos nas portas que vamos usar
for port in 5000 5173 3000; do
    if check_port $port; then
        echo -e "${YELLOW}⚠ Parando processo na porta $port...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
done

# Criar diretório de logs
mkdir -p logs

# Iniciar Backend (API)
echo -e "${BLUE}4. Iniciando Backend API (porta 5000)...${NC}"
cd builders-code-cms-backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar backend estar disponível
wait_for_service "http://localhost:5000/api/status" "Backend API"
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Falha ao iniciar Backend API${NC}"
    exit 1
fi

# Iniciar CMS Frontend (Admin)
echo -e "${BLUE}5. Iniciando CMS Frontend (porta 5173)...${NC}"
cd builders-code-cms-frontend
npm run dev > ../logs/cms-frontend.log 2>&1 &
CMS_FRONTEND_PID=$!
cd ..

# Aguardar CMS frontend estar disponível
wait_for_service "http://localhost:5173" "CMS Frontend"
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Falha ao iniciar CMS Frontend${NC}"
    exit 1
fi

# Iniciar Website Público
echo -e "${BLUE}6. Iniciando Website Público (porta 3000)...${NC}"
cd builders-code-v3
PORT=3000 npm start > ../logs/website.log 2>&1 &
WEBSITE_PID=$!
cd ..

# Aguardar website estar disponível
wait_for_service "http://localhost:3000" "Website Público"
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Falha ao iniciar Website Público${NC}"
    exit 1
fi

# Salvar PIDs para script de parada
cat > .ecosystem_pids << EOF
BACKEND_PID=$BACKEND_PID
CMS_FRONTEND_PID=$CMS_FRONTEND_PID
WEBSITE_PID=$WEBSITE_PID
EOF

echo ""
echo -e "${GREEN}🎉 ECOSSISTEMA INICIADO COM SUCESSO! 🎉${NC}"
echo "================================================"
echo ""
echo -e "${BLUE}📍 URLs das Aplicações:${NC}"
echo -e "  🔧 Backend API:     ${YELLOW}http://localhost:5000${NC}"
echo -e "  ⚙️  CMS Admin:       ${YELLOW}http://localhost:5173${NC}"
echo -e "  🌐 Website Público: ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📊 Status das Aplicações:${NC}"
echo -e "  Backend API:     ${GREEN}✓ Rodando (PID: $BACKEND_PID)${NC}"
echo -e "  CMS Frontend:    ${GREEN}✓ Rodando (PID: $CMS_FRONTEND_PID)${NC}"
echo -e "  Website Público: ${GREEN}✓ Rodando (PID: $WEBSITE_PID)${NC}"
echo ""
echo -e "${BLUE}🔑 Credenciais Admin:${NC}"
echo -e "  Email: ${YELLOW}admin@builderhub.com${NC}"
echo -e "  Senha: ${YELLOW}admin123${NC}"
echo ""
echo -e "${BLUE}📁 Logs:${NC}"
echo -e "  Backend:  ${YELLOW}logs/backend.log${NC}"
echo -e "  CMS:      ${YELLOW}logs/cms-frontend.log${NC}"
echo -e "  Website:  ${YELLOW}logs/website.log${NC}"
echo ""
echo -e "${BLUE}🛑 Para parar tudo:${NC}"
echo -e "  ${YELLOW}./stop-ecosystem.sh${NC}"
echo ""
echo -e "${GREEN}Pressione Ctrl+C para monitorar logs ou execute outro comando.${NC}"

# Monitorar logs (opcional)
if [ "$1" = "--follow-logs" ]; then
    echo -e "${BLUE}📝 Monitorando logs (Ctrl+C para sair)...${NC}"
    tail -f logs/*.log
fi
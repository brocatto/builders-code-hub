#!/bin/bash

# Builder's Code Hub - Script de Parada do Ecossistema
# Este script para todas as aplicações do ecossistema

echo "🛑 Parando Builder's Code Hub Ecossistema..."
echo "============================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se processo está rodando
is_running() {
    local pid=$1
    if ps -p $pid > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Carregar PIDs se existirem
if [ -f ".ecosystem_pids" ]; then
    source .ecosystem_pids
    echo -e "${BLUE}📋 PIDs carregados do arquivo...${NC}"
else
    echo -e "${YELLOW}⚠ Arquivo de PIDs não encontrado. Tentando parar por porta...${NC}"
fi

# Parar processos por PID
if [ ! -z "$BACKEND_PID" ] && is_running $BACKEND_PID; then
    echo -e "${BLUE}🔧 Parando Backend API (PID: $BACKEND_PID)...${NC}"
    kill $BACKEND_PID 2>/dev/null
    sleep 2
    if is_running $BACKEND_PID; then
        kill -9 $BACKEND_PID 2>/dev/null
    fi
    echo -e "${GREEN}✓ Backend API parado${NC}"
else
    echo -e "${YELLOW}⚠ Backend API não estava rodando ou PID inválido${NC}"
fi

if [ ! -z "$CMS_FRONTEND_PID" ] && is_running $CMS_FRONTEND_PID; then
    echo -e "${BLUE}⚙️ Parando CMS Frontend (PID: $CMS_FRONTEND_PID)...${NC}"
    kill $CMS_FRONTEND_PID 2>/dev/null
    sleep 2
    if is_running $CMS_FRONTEND_PID; then
        kill -9 $CMS_FRONTEND_PID 2>/dev/null
    fi
    echo -e "${GREEN}✓ CMS Frontend parado${NC}"
else
    echo -e "${YELLOW}⚠ CMS Frontend não estava rodando ou PID inválido${NC}"
fi

if [ ! -z "$WEBSITE_PID" ] && is_running $WEBSITE_PID; then
    echo -e "${BLUE}🌐 Parando Website Público (PID: $WEBSITE_PID)...${NC}"
    kill $WEBSITE_PID 2>/dev/null
    sleep 2
    if is_running $WEBSITE_PID; then
        kill -9 $WEBSITE_PID 2>/dev/null
    fi
    echo -e "${GREEN}✓ Website Público parado${NC}"
else
    echo -e "${YELLOW}⚠ Website Público não estava rodando ou PID inválido${NC}"
fi

# Parar processos por porta (backup)
echo -e "${BLUE}🧹 Limpeza adicional por porta...${NC}"

for port in 5000 5173 3000; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Processo ainda rodando na porta $port. Forçando parada...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
done

# Parar processos Node.js relacionados
echo -e "${BLUE}🧹 Limpeza de processos Node.js relacionados...${NC}"

# Matar nodemon e node processes específicos do projeto
pkill -f "nodemon.*src/server.js" 2>/dev/null || true
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "vite.*dev" 2>/dev/null || true

# Remover arquivo de PIDs
if [ -f ".ecosystem_pids" ]; then
    rm .ecosystem_pids
    echo -e "${GREEN}✓ Arquivo de PIDs removido${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ECOSSISTEMA PARADO COM SUCESSO! 🎉${NC}"
echo "=================================="
echo ""
echo -e "${BLUE}📊 Verificação Final:${NC}"

# Verificar se as portas estão livres
for port in 5000 5173 3000; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  Porta $port: ${RED}✗ Ainda em uso${NC}"
    else
        echo -e "  Porta $port: ${GREEN}✓ Livre${NC}"
    fi
done

echo ""
echo -e "${BLUE}🚀 Para iniciar novamente:${NC}"
echo -e "  ${YELLOW}./start-ecosystem.sh${NC}"
echo ""
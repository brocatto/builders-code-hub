#!/bin/bash

# Builder's Code Hub - Script de Status do Ecossistema
# Este script verifica o status de todas as aplicações

echo "📊 Builder's Code Hub - Status do Ecossistema"
echo "=============================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se porta está em uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Função para testar endpoint HTTP
test_endpoint() {
    local url=$1
    local timeout=${2:-5}
    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Função para obter PID da porta
get_pid_from_port() {
    local port=$1
    lsof -ti:$port 2>/dev/null | head -1
}

echo ""
echo -e "${BLUE}🔍 Verificando Aplicações...${NC}"

# Backend API (porta 5000)
echo -n "🔧 Backend API (porta 5000): "
if check_port 5000; then
    PID=$(get_pid_from_port 5000)
    if test_endpoint "http://localhost:5000/api/status"; then
        echo -e "${GREEN}✓ Rodando (PID: $PID)${NC}"
        # Testar MongoDB
        MONGO_STATUS=$(curl -s http://localhost:5000/api/status | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
        echo -e "  └─ Status: ${GREEN}$MONGO_STATUS${NC}"
    else
        echo -e "${YELLOW}⚠ Porta ocupada mas não responde (PID: $PID)${NC}"
    fi
else
    echo -e "${RED}✗ Não está rodando${NC}"
fi

# CMS Frontend (porta 5173)
echo -n "⚙️  CMS Frontend (porta 5173): "
if check_port 5173; then
    PID=$(get_pid_from_port 5173)
    if test_endpoint "http://localhost:5173"; then
        echo -e "${GREEN}✓ Rodando (PID: $PID)${NC}"
        echo -e "  └─ Admin URL: ${YELLOW}http://localhost:5173${NC}"
    else
        echo -e "${YELLOW}⚠ Porta ocupada mas não responde (PID: $PID)${NC}"
    fi
else
    echo -e "${RED}✗ Não está rodando${NC}"
fi

# Website Público (porta 3000)
echo -n "🌐 Website Público (porta 3000): "
if check_port 3000; then
    PID=$(get_pid_from_port 3000)
    if test_endpoint "http://localhost:3000"; then
        echo -e "${GREEN}✓ Rodando (PID: $PID)${NC}"
        echo -e "  └─ Website URL: ${YELLOW}http://localhost:3000${NC}"
    else
        echo -e "${YELLOW}⚠ Porta ocupada mas não responde (PID: $PID)${NC}"
    fi
else
    echo -e "${RED}✗ Não está rodando${NC}"
fi

echo ""
echo -e "${BLUE}🔗 Testando Conectividade...${NC}"

# Testar conectividade entre aplicações
echo -n "🔄 Website → Backend API: "
if test_endpoint "http://localhost:5000/api/projetos/public"; then
    echo -e "${GREEN}✓ Conectado${NC}"
    PROJECTS_COUNT=$(curl -s http://localhost:5000/api/projetos/public | grep -o '"results":[0-9]*' | cut -d':' -f2)
    echo -e "  └─ Projetos disponíveis: ${YELLOW}$PROJECTS_COUNT${NC}"
else
    echo -e "${RED}✗ Falha na conexão${NC}"
fi

echo -n "🔄 CMS → Backend API: "
if test_endpoint "http://localhost:5000/api/status"; then
    echo -e "${GREEN}✓ Conectado${NC}"
else
    echo -e "${RED}✗ Falha na conexão${NC}"
fi

echo ""
echo -e "${BLUE}💾 Verificando Dados...${NC}"

# Verificar dados no banco
if test_endpoint "http://localhost:5000/api/projetos/public"; then
    PROJECTS_DATA=$(curl -s http://localhost:5000/api/projetos/public)
    PROJECTS_COUNT=$(echo "$PROJECTS_DATA" | grep -o '"results":[0-9]*' | cut -d':' -f2)
    echo -e "📊 Projetos no banco: ${YELLOW}$PROJECTS_COUNT${NC}"
    
    if [ "$PROJECTS_COUNT" -gt 0 ]; then
        echo -e "  └─ ${GREEN}✓ Dados disponíveis${NC}"
    else
        echo -e "  └─ ${YELLOW}⚠ Nenhum projeto encontrado${NC}"
    fi
else
    echo -e "📊 Projetos no banco: ${RED}✗ Erro ao acessar${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Informações do Sistema...${NC}"

# Carregar PIDs se existirem
if [ -f ".ecosystem_pids" ]; then
    source .ecosystem_pids
    echo -e "📋 PIDs salvos:"
    echo -e "  Backend: ${YELLOW}${BACKEND_PID:-"N/A"}${NC}"
    echo -e "  CMS Frontend: ${YELLOW}${CMS_FRONTEND_PID:-"N/A"}${NC}"
    echo -e "  Website: ${YELLOW}${WEBSITE_PID:-"N/A"}${NC}"
else
    echo -e "${YELLOW}⚠ Arquivo de PIDs não encontrado${NC}"
fi

# Verificar logs
echo ""
echo -e "${BLUE}📁 Status dos Logs...${NC}"
for log in "logs/backend.log" "logs/cms-frontend.log" "logs/website.log"; do
    if [ -f "$log" ]; then
        SIZE=$(du -h "$log" | cut -f1)
        LINES=$(wc -l < "$log")
        echo -e "  $log: ${GREEN}✓ $SIZE ($LINES linhas)${NC}"
    else
        echo -e "  $log: ${YELLOW}⚠ Não encontrado${NC}"
    fi
done

echo ""
echo -e "${BLUE}🎯 Ações Disponíveis:${NC}"
echo -e "  🚀 Iniciar: ${YELLOW}./start-ecosystem.sh${NC}"
echo -e "  🛑 Parar:   ${YELLOW}./stop-ecosystem.sh${NC}"
echo -e "  📊 Status:  ${YELLOW}./status-ecosystem.sh${NC}"
echo -e "  📝 Logs:    ${YELLOW}tail -f logs/*.log${NC}"
echo ""

# Status resumido
BACKEND_OK=$(check_port 5000 && echo "1" || echo "0")
CMS_OK=$(check_port 5173 && echo "1" || echo "0")
WEBSITE_OK=$(check_port 3000 && echo "1" || echo "0")
TOTAL_OK=$((BACKEND_OK + CMS_OK + WEBSITE_OK))

if [ $TOTAL_OK -eq 3 ]; then
    echo -e "${GREEN}🎉 ECOSSISTEMA: TOTALMENTE OPERACIONAL ($TOTAL_OK/3)${NC}"
elif [ $TOTAL_OK -gt 0 ]; then
    echo -e "${YELLOW}⚠ ECOSSISTEMA: PARCIALMENTE OPERACIONAL ($TOTAL_OK/3)${NC}"
else
    echo -e "${RED}❌ ECOSSISTEMA: INATIVO ($TOTAL_OK/3)${NC}"
fi

echo ""
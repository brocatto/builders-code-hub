#!/bin/bash

# Builder's Code Hub - Start All Applications Script
echo "🚀 Starting Builder's Code Hub Ecosystem..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $port is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to start a service
start_service() {
    local name=$1
    local directory=$2
    local command=$3
    local port=$4
    
    echo -e "${BLUE}📦 Starting $name...${NC}"
    
    if [ -d "$directory" ]; then
        cd "$directory"
        
        # Check if package.json exists
        if [ ! -f "package.json" ]; then
            echo -e "${RED}❌ package.json not found in $directory${NC}"
            return 1
        fi
        
        # Install dependencies if node_modules doesn't exist
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}📥 Installing dependencies for $name...${NC}"
            npm install
        fi
        
        # Check port availability
        if [ -n "$port" ]; then
            check_port $port
            if [ $? -eq 1 ]; then
                echo -e "${RED}❌ Cannot start $name - port conflict${NC}"
                return 1
            fi
        fi
        
        # Start the service in background
        echo -e "${GREEN}✅ Starting $name on port $port...${NC}"
        eval "$command &"
        
        # Store the PID
        echo $! > "${name,,}.pid"
        
        cd - > /dev/null
        
        # Wait a moment for the service to start
        sleep 2
        
        echo -e "${GREEN}✅ $name started successfully${NC}"
    else
        echo -e "${RED}❌ Directory $directory not found${NC}"
        return 1
    fi
}

# Create logs directory
mkdir -p logs

echo -e "${BLUE}🔍 Checking system requirements...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ System requirements check passed${NC}"

# Start Backend API (MongoDB + Express)
echo -e "\n${BLUE}=== BACKEND API ===${NC}"
start_service "Backend" "./builders-code-cms-backend" "npm run dev > ../logs/backend.log 2>&1" "5000"

# Wait for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
sleep 5

# Start CMS Frontend (Vite + React)
echo -e "\n${BLUE}=== CMS FRONTEND ===${NC}"
start_service "CMS Frontend" "./builders-code-cms-frontend" "npm run dev > ../logs/cms-frontend.log 2>&1" "5173"

# Start Website v3 (Create React App)
echo -e "\n${BLUE}=== WEBSITE V3 ===${NC}"
start_service "Website v3" "./builders-code-v3" "npm start > ../logs/website-v3.log 2>&1" "3000"

echo -e "\n${GREEN}🎉 All services started successfully!${NC}"
echo -e "${BLUE}📋 Service Status:${NC}"
echo -e "  🔗 Backend API:    http://localhost:5000"
echo -e "  🔗 CMS Frontend:   http://localhost:5173"  
echo -e "  🔗 Website v3:     http://localhost:3000"

echo -e "\n${BLUE}📋 Useful Commands:${NC}"
echo -e "  📊 Check status:   ./status.sh"
echo -e "  🛑 Stop all:       ./stop-all.sh"
echo -e "  📝 View logs:      tail -f logs/*.log"

echo -e "\n${YELLOW}💡 Tips:${NC}"
echo -e "  • Access CMS Admin: http://localhost:5173/login"
echo -e "  • Default credentials: admin / admin123"
echo -e "  • API health check: http://localhost:5000/api/status"
echo -e "  • MongoDB connection will be tested automatically"

echo -e "\n${GREEN}✨ Builder's Code Hub is ready!${NC}"
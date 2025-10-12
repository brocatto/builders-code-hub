#!/bin/bash

# Builder's Code Hub - Stop All Applications Script
echo "🛑 Stopping Builder's Code Hub Ecosystem..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to stop a service by PID file
stop_service_by_pid() {
    local name=$1
    local pid_file="${name,,}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null; then
            echo -e "${BLUE}🛑 Stopping $name (PID: $pid)...${NC}"
            kill $pid
            
            # Wait for process to stop
            local count=0
            while ps -p $pid > /dev/null && [ $count -lt 10 ]; do
                sleep 1
                ((count++))
            done
            
            if ps -p $pid > /dev/null; then
                echo -e "${YELLOW}⚠️  Force killing $name...${NC}"
                kill -9 $pid
            fi
            
            echo -e "${GREEN}✅ $name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $name process not found${NC}"
        fi
        
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  $name PID file not found${NC}"
    fi
}

# Function to stop services by port
stop_service_by_port() {
    local name=$1
    local port=$2
    
    echo -e "${BLUE}🔍 Looking for $name on port $port...${NC}"
    
    local pids=$(lsof -ti:$port)
    
    if [ -n "$pids" ]; then
        echo -e "${BLUE}🛑 Stopping $name processes on port $port...${NC}"
        echo "$pids" | xargs kill
        
        # Wait and force kill if necessary
        sleep 2
        local remaining_pids=$(lsof -ti:$port)
        if [ -n "$remaining_pids" ]; then
            echo -e "${YELLOW}⚠️  Force killing remaining $name processes...${NC}"
            echo "$remaining_pids" | xargs kill -9
        fi
        
        echo -e "${GREEN}✅ $name stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  No $name process found on port $port${NC}"
    fi
}

echo -e "${BLUE}🔍 Stopping services...${NC}"

# Stop by PID files first (more graceful)
echo -e "\n${BLUE}=== Stopping by PID files ===${NC}"
stop_service_by_pid "Backend"
stop_service_by_pid "CMS Frontend" 
stop_service_by_pid "Website v3"

# Stop by ports as fallback
echo -e "\n${BLUE}=== Stopping by ports (fallback) ===${NC}"
stop_service_by_port "Backend" "5000"
stop_service_by_port "CMS Frontend" "5173"
stop_service_by_port "Website v3" "3000"

# Clean up any remaining Node.js processes that might be related
echo -e "\n${BLUE}🧹 Cleaning up...${NC}"

# Remove PID files
rm -f backend.pid cms-frontend.pid website-v3.pid

# Check for any remaining processes
echo -e "${BLUE}🔍 Final check for remaining processes...${NC}"

local remaining_5000=$(lsof -ti:5000)
local remaining_5173=$(lsof -ti:5173)
local remaining_3000=$(lsof -ti:3000)

if [ -n "$remaining_5000" ] || [ -n "$remaining_5173" ] || [ -n "$remaining_3000" ]; then
    echo -e "${YELLOW}⚠️  Some processes might still be running${NC}"
    echo -e "${BLUE}🔍 You can check manually with: lsof -ti:5000,5173,3000${NC}"
else
    echo -e "${GREEN}✅ All ports are now free${NC}"
fi

echo -e "\n${GREEN}🎉 All Builder's Code Hub services stopped!${NC}"
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo -e "  🚀 Start all:      ./start-all.sh"
echo -e "  📊 Check status:   ./status.sh"
echo -e "  🔍 Check ports:    lsof -ti:5000,5173,3000"

echo -e "\n${GREEN}✨ Shutdown complete!${NC}"
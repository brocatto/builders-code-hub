#!/bin/bash

# Builder's Code Hub - Status Check Script
echo "📊 Builder's Code Hub - System Status"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check service status
check_service() {
    local name=$1
    local port=$2
    local url=$3
    
    echo -e "\n${BLUE}🔍 Checking $name...${NC}"
    
    # Check if port is in use
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✅ Port $port: ACTIVE${NC}"
        
        # Try to make HTTP request if URL provided
        if [ -n "$url" ]; then
            if curl -s --max-time 5 "$url" >/dev/null 2>&1; then
                echo -e "${GREEN}✅ HTTP Check: RESPONDING${NC}"
            else
                echo -e "${YELLOW}⚠️  HTTP Check: NOT RESPONDING${NC}"
            fi
        fi
        
        # Show process details
        local pid=$(lsof -ti:$port | head -n1)
        if [ -n "$pid" ]; then
            local process_info=$(ps -p $pid -o pid,pcpu,pmem,etime,cmd --no-headers 2>/dev/null)
            if [ -n "$process_info" ]; then
                echo -e "${BLUE}📋 Process: $process_info${NC}"
            fi
        fi
        
        return 0
    else
        echo -e "${RED}❌ Port $port: INACTIVE${NC}"
        return 1
    fi
}

# Function to check MongoDB connection
check_mongodb() {
    echo -e "\n${BLUE}🔍 Checking MongoDB Connection...${NC}"
    
    # Try to connect to MongoDB using the backend API
    if curl -s --max-time 10 "http://localhost:5000/api/status" >/dev/null 2>&1; then
        local response=$(curl -s --max-time 10 "http://localhost:5000/api/status" 2>/dev/null)
        if echo "$response" | grep -q "success"; then
            echo -e "${GREEN}✅ MongoDB: CONNECTED${NC}"
            echo -e "${BLUE}📋 API Response: $response${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  MongoDB: CONNECTION UNCERTAIN${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ MongoDB: CANNOT CHECK (Backend not responding)${NC}"
        return 1
    fi
}

# Function to show system resources
show_resources() {
    echo -e "\n${BLUE}💻 System Resources:${NC}"
    
    # Memory usage
    local mem_usage=$(free -h | awk 'NR==2{printf "Memory: %s/%s (%.2f%%)", $3,$2,$3*100/$2 }')
    echo -e "${BLUE}📊 $mem_usage${NC}"
    
    # Disk usage
    local disk_usage=$(df -h . | awk 'NR==2{printf "Disk: %s/%s (%s)", $3,$2,$5}')
    echo -e "${BLUE}💾 $disk_usage${NC}"
    
    # Load average
    local load_avg=$(uptime | awk -F'load average:' '{ print $2 }')
    echo -e "${BLUE}⚡ Load Average:$load_avg${NC}"
}

# Function to show recent logs
show_recent_logs() {
    echo -e "\n${BLUE}📝 Recent Logs (last 5 lines):${NC}"
    
    if [ -d "logs" ]; then
        for log_file in logs/*.log; do
            if [ -f "$log_file" ]; then
                local service_name=$(basename "$log_file" .log)
                echo -e "\n${YELLOW}--- $service_name ---${NC}"
                tail -n 5 "$log_file" 2>/dev/null || echo "No logs available"
            fi
        done
    else
        echo -e "${YELLOW}⚠️  Logs directory not found${NC}"
    fi
}

# Header
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Builder's Code Hub Status${NC}"
echo -e "${BLUE}  $(date)${NC}"
echo -e "${BLUE}================================${NC}"

# Check all services
backend_status=$(check_service "Backend API" "5000" "http://localhost:5000/api/status"; echo $?)
cms_status=$(check_service "CMS Frontend" "5173" "http://localhost:5173"; echo $?)
website_status=$(check_service "Website v3" "3000" "http://localhost:3000"; echo $?)

# Check MongoDB if backend is running
if [ $backend_status -eq 0 ]; then
    mongodb_status=$(check_mongodb; echo $?)
else
    echo -e "\n${RED}❌ Cannot check MongoDB (Backend not running)${NC}"
    mongodb_status=1
fi

# Show system resources
show_resources

# Summary
echo -e "\n${BLUE}📋 SUMMARY:${NC}"
echo -e "${BLUE}================================${NC}"

if [ $backend_status -eq 0 ]; then
    echo -e "${GREEN}✅ Backend API (Port 5000)${NC}"
else
    echo -e "${RED}❌ Backend API (Port 5000)${NC}"
fi

if [ $cms_status -eq 0 ]; then
    echo -e "${GREEN}✅ CMS Frontend (Port 5173)${NC}"
else
    echo -e "${RED}❌ CMS Frontend (Port 5173)${NC}"
fi

if [ $website_status -eq 0 ]; then
    echo -e "${GREEN}✅ Website v3 (Port 3000)${NC}"
else
    echo -e "${RED}❌ Website v3 (Port 3000)${NC}"
fi

if [ $mongodb_status -eq 0 ]; then
    echo -e "${GREEN}✅ MongoDB Connection${NC}"
else
    echo -e "${RED}❌ MongoDB Connection${NC}"
fi

# Overall status
total_services=4
active_services=0
[ $backend_status -eq 0 ] && ((active_services++))
[ $cms_status -eq 0 ] && ((active_services++))
[ $website_status -eq 0 ] && ((active_services++))
[ $mongodb_status -eq 0 ] && ((active_services++))

echo -e "\n${BLUE}🎯 Overall Status: $active_services/$total_services services active${NC}"

if [ $active_services -eq $total_services ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
    echo -e "\n${BLUE}🔗 Access URLs:${NC}"
    echo -e "  • Website:     http://localhost:3000"
    echo -e "  • CMS Admin:   http://localhost:5173"
    echo -e "  • API Status:  http://localhost:5000/api/status"
elif [ $active_services -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Partial system availability${NC}"
    echo -e "${BLUE}💡 Run './start-all.sh' to start missing services${NC}"
else
    echo -e "${RED}❌ All systems down${NC}"
    echo -e "${BLUE}💡 Run './start-all.sh' to start all services${NC}"
fi

# Show recent logs if requested
if [ "$1" = "--logs" ] || [ "$1" = "-l" ]; then
    show_recent_logs
fi

echo -e "\n${BLUE}📋 Available Commands:${NC}"
echo -e "  🚀 Start all:      ./start-all.sh"
echo -e "  🛑 Stop all:       ./stop-all.sh"
echo -e "  📊 Status + logs:  ./status.sh --logs"
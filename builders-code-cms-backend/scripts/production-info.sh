#!/bin/bash

# ==========================================
# BUILDERS CODE CMS - PRODUCTION INFO
# ==========================================

echo "🚀 Builder's Code CMS - Production Information"
echo "============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Production URLs
echo -e "${BLUE}📍 Production URLs:${NC}"
echo "======================================"
echo -e "${GREEN}🌐 API Base URL:${NC}"
echo "   https://builders-code-cms-backend-i3c2r53m1-brocattos-projects.vercel.app"
echo ""
echo -e "${GREEN}📊 Health Check:${NC}"
echo "   https://builders-code-cms-backend-i3c2r53m1-brocattos-projects.vercel.app/api/status"
echo ""
echo -e "${GREEN}🔐 Authentication:${NC}"
echo "   https://builders-code-cms-backend-i3c2r53m1-brocattos-projects.vercel.app/api/auth/login"
echo ""

# API Endpoints
echo -e "${BLUE}🔗 Available API Endpoints:${NC}"
echo "======================================"
echo "• Authentication:    /api/auth/*"
echo "• Projects:          /api/projetos/*"
echo "• Categories:        /api/categorias/*"
echo "• Sections:          /api/secoes/*"
echo "• Logs:              /api/logs/*"
echo "• Ideas:             /api/ideias/*"
echo "• Media:             /api/midias/*"
echo "• Configurations:    /api/configuracoes/*"
echo ""

# Admin Credentials
echo -e "${YELLOW}👤 Admin Credentials:${NC}"
echo "======================================"
echo "Username: admin"
echo "Password: admin123"
echo -e "${RED}⚠️  IMPORTANT: Change password after first login!${NC}"
echo ""

# Environment Status
echo -e "${BLUE}🔧 Environment Configuration:${NC}"
echo "======================================"
echo "• Node Environment:   production"
echo "• Platform:           Vercel"
echo "• Region:             US East (iad1)"
echo "• Runtime:            Node.js"
echo "• Database:           MongoDB Atlas"
echo ""

# Database Status
echo -e "${BLUE}📊 Database Status:${NC}"
echo "======================================"
echo "• Admin User:         ✅ Created"
echo "• Categories:         ✅ 5 created"
echo "• Sections:           ✅ 4 created"
echo "• Configurations:     ✅ 8 created"
echo "• Sample Project:     ✅ Created"
echo ""

# Security Notes
echo -e "${YELLOW}🔒 Security Notes:${NC}"
echo "======================================"
echo "• API is protected by Vercel authentication"
echo "• JWT authentication for application access"
echo "• CORS configured for frontend integration"
echo "• All environment variables encrypted"
echo ""

# Next Steps
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "======================================"
echo "1. Deploy frontend application"
echo "2. Update FRONTEND_URL environment variable"
echo "3. Change admin password on first login"
echo "4. Test frontend-backend integration"
echo "5. Configure custom domain (optional)"
echo ""

# Troubleshooting
echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
echo "======================================"
echo "If you see authentication errors:"
echo "• Check Vercel team access permissions"
echo "• Verify environment variables are set"
echo "• Ensure MongoDB Atlas IP whitelist"
echo ""

echo -e "${GREEN}✅ Backend deployment completed successfully!${NC}"
echo -e "${GREEN}🎉 Builder's Code CMS API is live in production!${NC}"
echo ""
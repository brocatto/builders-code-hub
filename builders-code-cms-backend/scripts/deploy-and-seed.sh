#!/bin/bash

# ==========================================
# BUILDERS CODE CMS - DEPLOY & SEED SCRIPT
# ==========================================

echo "🚀 Builder's Code CMS - Deploy & Seed Production"
echo "================================================"

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ Error: This script must be run from the backend directory"
    exit 1
fi

echo "📁 Working directory: $(pwd)"
echo ""

# 1. Deploy to Vercel
echo "🔄 Step 1: Deploying to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "✅ Deployment successful!"
echo ""

# 2. Run seeding script
echo "🔄 Step 2: Seeding production database..."
echo "⚠️  Make sure your MONGODB_URI points to the production database!"
echo ""

# Set production environment
export NODE_ENV=production

# Run the seeding script
npm run seed:prod

if [ $? -ne 0 ]; then
    echo "❌ Seeding failed!"
    exit 1
fi

echo "✅ Database seeding completed!"
echo ""

# 3. Get production URLs
echo "🔗 Production URLs:"
echo "================================================"

# Get the latest deployment URL
LATEST_URL=$(vercel ls | grep "builders-code-cms-backend" | head -1 | awk '{print $2}')

if [ -n "$LATEST_URL" ]; then
    echo "🌐 API Base URL: https://$LATEST_URL"
    echo "📊 Status Check: https://$LATEST_URL/api/status"
    echo "🔐 Login: https://$LATEST_URL/api/auth/login"
    echo ""
    echo "👤 Admin Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo "   ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!"
else
    echo "⚠️  Could not determine production URL. Check Vercel dashboard."
fi

echo ""
echo "✅ Deployment and seeding completed successfully!"
echo "🎉 Your Builder's Code CMS backend is now live in production!"
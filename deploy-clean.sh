#!/bin/bash
# ClawFactory Clean Deployment Script
# Usage: ./deploy-clean.sh [--railway] [--local]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🦞 ClawFactory Clean Deployment${NC}"
echo "================================"

# Parse arguments
DEPLOY_RAILWAY=false
DEPLOY_LOCAL=false

for arg in "$@"; do
    case $arg in
        --railway)
            DEPLOY_RAILWAY=true
            shift
            ;;
        --local)
            DEPLOY_LOCAL=true
            shift
            ;;
        --help|-h)
            echo "Usage: ./deploy-clean.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --railway    Deploy to Railway with clean cache"
            echo "  --local      Run local development server"
            echo "  --help       Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./deploy-clean.sh --local"
            echo "  ./deploy-clean.sh --railway"
            exit 0
            ;;
    esac
done

# Check if Railway CLI is installed
check_railway() {
    if ! command -v railway &> /dev/null; then
        echo -e "${RED}❌ Railway CLI not found. Install with: npm i -g @railway/cli${NC}"
        return 1
    fi
    return 0
}

# Clean build artifacts
clean_build() {
    echo -e "${YELLOW}🧹 Cleaning build artifacts...${NC}"
    rm -rf backend/data/*.db
    rm -rf backend/node_modules/.cache 2>/dev/null || true
    echo -e "${GREEN}✅ Build artifacts cleaned${NC}"
}

# Local deployment
deploy_local() {
    echo -e "${YELLOW}🚀 Starting local development server...${NC}"
    cd "$(dirname "$0")"
    clean_build
    npm run dev
}

# Railway deployment with clean cache
deploy_railway() {
    echo -e "${YELLOW}🚂 Deploying to Railway with clean cache...${NC}"
    
    check_railway || exit 1
    
    cd "$(dirname "$0")"
    
    # Login to Railway (if not already logged in)
    echo ""
    echo -e "${YELLOW}📝 Ensure you're logged in to Railway${NC}"
    railway login --interactive=false || railway login
    
    # Link to project (if not already linked)
    if [ ! -f ".railway.json" ]; then
        echo -e "${YELLOW}🔗 Linking to Railway project...${NC}"
        railway link
    fi
    
    # Deploy with clean cache
    echo ""
    echo -e "${YELLOW}📦 Deploying (clean cache)...${NC}"
    railway up --no-cache
    
    echo ""
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    echo -e "${GREEN}🌐 Check your deployment at: https://railway.app/project/${NC}"
}

# Main execution
if [ "$DEPLOY_LOCAL" = true ]; then
    deploy_local
elif [ "$DEPLOY_RAILWAY" = true ]; then
    deploy_railway
else
    echo -e "${YELLOW}⚠️  No deployment target specified.${NC}"
    echo ""
    echo "Usage: ./deploy-clean.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --railway    Deploy to Railway with clean cache"
    echo "  --local      Run local development server"
    echo "  --help       Show this help message"
    echo ""
    echo -e "${YELLOW}Tip: Run ${GREEN}./deploy-clean.sh --local${YELLOW} to test locally${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Done!${NC}"

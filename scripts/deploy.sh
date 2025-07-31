#!/bin/bash

# Production deployment script

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Build for production
build_release() {
    log_info "Building release version..."
    dotnet clean
    dotnet restore
    dotnet build -c Release --no-restore
    dotnet test -c Release --no-build --verbosity minimal
    dotnet publish -c Release -o ./publish --no-build
}

# Create Docker image
build_docker() {
    local image_name=${1:-"app"}
    local tag=${2:-"latest"}
    
    log_info "Building Docker image: $image_name:$tag"
    docker build -t "$image_name:$tag" .
}

# Deploy to staging
deploy_staging() {
    log_info "Deploying to staging..."
    build_release
    
    # Example: copy to staging server
    # rsync -avz --delete ./publish/ user@staging-server:/app/
    log_info "Staging deployment complete"
}

# Deploy to production
deploy_production() {
    log_warn "Production deployment - are you sure? (y/N)"
    read -r confirmation
    if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled"
        exit 0
    fi
    
    log_info "Deploying to production..."
    build_release
    
    # Example: production deployment steps
    # - Update production Seq configuration
    # - Deploy to production servers
    # - Health check
    
    log_info "Production deployment complete"
}

# Health check
health_check() {
    local url=${1:-"http://localhost:5000/health"}
    log_info "Running health check: $url"
    
    if curl -sf "$url" > /dev/null; then
        log_info "Health check passed"
    else
        log_error "Health check failed"
        exit 1
    fi
}

# Main command dispatcher
case "${1:-help}" in
    "build")
        build_release
        ;;
    "docker")
        build_docker "$2" "$3"
        ;;
    "staging")
        deploy_staging
        ;;
    "production")
        deploy_production
        ;;
    "health")
        health_check "$2"
        ;;
    "help"|*)
        echo "Production deployment script"
        echo ""
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  build         Build release version"
        echo "  docker        Build Docker image [name] [tag]"
        echo "  staging       Deploy to staging environment"
        echo "  production    Deploy to production environment"
        echo "  health        Run health check [url]"
        echo "  help          Show this help"
        ;;
esac
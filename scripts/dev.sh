#!/bin/bash

# Development workflow script

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Seq is running
check_seq() {
    if ! curl -s http://localhost:5341/api/events > /dev/null 2>&1; then
        log_warn "Seq not running. Starting..."
        docker-compose up -d seq
        sleep 5
    else
        log_info "Seq is running"
    fi
}

# Build project
build() {
    log_info "Building project..."
    dotnet build
}

# Run with hot reload
run() {
    check_seq
    log_info "Starting development server with hot reload..."
    dotnet watch run
}

# Run tests
test() {
    log_info "Running tests..."
    dotnet test --verbosity minimal
}

# Clean build artifacts
clean() {
    log_info "Cleaning build artifacts..."
    dotnet clean
    rm -rf bin obj
}

# Setup new project
setup() {
    local project_name=$1
    if [ -z "$project_name" ]; then
        log_error "Usage: $0 setup <ProjectName>"
        exit 1
    fi
    
    log_info "Setting up new project: $project_name"
    ./templates/csharp-api/create-project.sh "$project_name"
    cd "$project_name"
    dotnet restore
    log_info "Project setup complete!"
}

# Main command dispatcher
case "${1:-help}" in
    "build")
        build
        ;;
    "run")
        run
        ;;
    "test")
        test
        ;;
    "clean")
        clean
        ;;
    "setup")
        setup "$2"
        ;;
    "seq")
        check_seq
        log_info "Seq UI: http://localhost:5341"
        ;;
    "help"|*)
        echo "Development workflow script"
        echo ""
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  build     Build the project"
        echo "  run       Start development server with hot reload"
        echo "  test      Run tests"
        echo "  clean     Clean build artifacts"
        echo "  setup     Create new project from template"
        echo "  seq       Start Seq logging server"
        echo "  help      Show this help"
        ;;
esac
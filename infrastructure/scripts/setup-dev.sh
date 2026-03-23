#!/bin/bash
# =============================================================
# Dev environment setup script
# =============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Setting up Asset Management Platform development environment..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required. Run: npm install -g pnpm"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ docker-compose is required."; exit 1; }

echo "✅ Prerequisites verified"

# Copy env files
if [ ! -f "$ROOT_DIR/.env" ]; then
  cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
  echo "✅ Created .env from .env.example"
else
  echo "ℹ️  .env already exists, skipping"
fi

if [ ! -f "$ROOT_DIR/apps/backend/.env" ]; then
  cp "$ROOT_DIR/apps/backend/.env.example" "$ROOT_DIR/apps/backend/.env"
  echo "✅ Created apps/backend/.env"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose -f "$ROOT_DIR/infrastructure/docker/docker-compose.yml" up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "✅ Development environment ready!"
echo ""
echo "   Backend:   http://localhost:3000"
echo "   Frontend:  http://localhost:5173"
echo "   Swagger:   http://localhost:3000/api/docs"
echo ""
echo "   To start: pnpm dev"

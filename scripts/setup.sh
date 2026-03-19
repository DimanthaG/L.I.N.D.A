#!/bin/bash

set -e

echo "🚀 Setting up L.I.N.D.A..."

if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your Reddit API credentials"
    echo "   Get credentials at: https://www.reddit.com/prefs/apps"
    read -p "Press enter when ready to continue..."
fi

echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🗄️  Running database migrations..."
npm run migration:run

echo "🌱 Seeding initial data..."
npm run seed

cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Backend:  cd backend && npm run start:dev"
echo "  2. Frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up -d"
echo ""
echo "Access the app at: http://localhost:3000"
echo "API docs at: http://localhost:3001/api/docs"

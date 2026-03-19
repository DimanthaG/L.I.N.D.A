#!/bin/bash

set -e

echo "⚠️  WARNING: This will delete all data in the database!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo "🗑️  Dropping database..."
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS linda;"

echo "🆕 Creating fresh database..."
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE linda;"

echo "🗄️  Running migrations..."
cd backend
npm run migration:run

echo "🌱 Seeding data..."
npm run seed

cd ..

echo "✅ Database reset complete!"

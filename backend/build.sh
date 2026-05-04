#!/bin/bash
set -e

echo "=== Building Frontend ==="
cd /app/../frontend || cd ../frontend
npm install
npm run build

echo "=== Building Backend ==="
cd /app/../backend || cd ../backend
npx prisma generate
npx tsc

echo "=== Running DB migrations ==="
npx prisma db push

echo "=== Build complete ==="

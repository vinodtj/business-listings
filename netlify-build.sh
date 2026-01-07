#!/bin/bash
# Netlify Build Script - Handles errors gracefully
set -e

echo "🚀 Starting Netlify build process..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Step 2: Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate || {
  echo "⚠️  Prisma generate failed, but continuing..."
  echo "This might work if Prisma was generated in postinstall"
}

# Step 3: Build Next.js
echo "🏗️  Building Next.js application..."
npm run build || {
  echo "❌ Build failed!"
  exit 1
}

echo "✅ Build completed successfully!"


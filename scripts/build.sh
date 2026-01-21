#!/bin/sh

set -e

cd "$(dirname "$0")/.."

################################################################################
# build (TypeScript only, non-minified, readable output)
################################################################################

echo "Building screenshot-basic with TypeScript compiler (non-minified)..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Clean previous build
rm -rf build dist

# Create dist directory
mkdir -p dist

# Build server and client with TypeScript
echo "Building server and client..."
npx tsc

# Build UI separately with esbuild (bundles @citizenfx/three)
echo "Building UI..."
npx esbuild ui/src/main.ts --bundle --sourcemap --format=esm --outfile=dist/ui.js --minify=false

# Copy UI HTML to dist
echo "Copying UI files..."
cp ui/index.html dist/ui.html

# Create build directory and copy files
echo "Creating build directory..."
mkdir -p build

# Copy dist files
cp -r dist build/

# Copy fxmanifest.lua
cp fxmanifest.lua build/

echo "Build complete! Output in ./build directory"
echo "Files generated:"
echo "  - build/dist/client.js (+ .map)"
echo "  - build/dist/server.js (+ .map)"
echo "  - build/dist/ui.js (+ .map)"
echo "  - build/dist/ui.html"
echo "  - build/fxmanifest.lua"

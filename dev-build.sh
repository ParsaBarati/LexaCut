#!/bin/bash
# Auto-build and deploy LexaCut plugin for rapid testing
# This watches for changes and automatically rebuilds

set -e

echo "🔨 LexaCut Development Build Script"
echo ""

# Configuration
SKETCHUP_PLUGINS_DIR="$HOME/Library/Application Support/SketchUp 2024/SketchUp/Plugins"
PROJECT_DIR="/Volumes/Work/Code/Startups/OpenCutList"
BUILD_DIR="$PROJECT_DIR/build"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

build_plugin() {
    echo -e "${BLUE}📦 Building plugin...${NC}"
    cd "$BUILD_DIR"
    npm run build 2>&1 | grep -E "(✔|✓|Error|error)" || true
    
    if [ -f "$PROJECT_DIR/dist/lexacut-v8.0.14.rbz" ]; then
        echo -e "${GREEN}✅ Build successful!${NC}"
        
        # Extract and copy to SketchUp plugins directory
        echo -e "${BLUE}📁 Deploying to SketchUp...${NC}"
        
        # Create temp directory
        TEMP_DIR=$(mktemp -d)
        cd "$TEMP_DIR"
        
        # Unzip the plugin
        unzip -q "$PROJECT_DIR/dist/lexacut-v8.0.14.rbz"
        
        # Copy to SketchUp plugins directory
        if [ -d "$SKETCHUP_PLUGINS_DIR" ]; then
            cp -R ladb_lexacut "$SKETCHUP_PLUGINS_DIR/"
            cp lexacut.rb "$SKETCHUP_PLUGINS_DIR/"
            echo -e "${GREEN}✅ Deployed to SketchUp plugins directory${NC}"
            echo -e "${YELLOW}⚠️  You'll still need to reload in SketchUp (use Ruby Console)${NC}"
        else
            echo -e "${YELLOW}⚠️  SketchUp plugins directory not found: $SKETCHUP_PLUGINS_DIR${NC}"
            echo "   Please manually copy the files"
        fi
        
        # Cleanup
        cd -
        rm -rf "$TEMP_DIR"
        
        return 0
    else
        echo -e "${YELLOW}⚠️  Build failed${NC}"
        return 1
    fi
}

# Option 1: Single build
if [ "$1" == "once" ]; then
    build_plugin
    exit 0
fi

# Option 2: Watch mode
echo -e "${BLUE}👀 Watching for changes...${NC}"
echo "Press Ctrl+C to stop"
echo ""

# Use fswatch if available (install with: brew install fswatch)
if command -v fswatch &> /dev/null; then
    fswatch -o "$PROJECT_DIR/src/ladb_lexacut" | while read change; do
        echo ""
        echo -e "${YELLOW}🔄 Changes detected, rebuilding...${NC}"
        build_plugin
        echo ""
        echo -e "${BLUE}👀 Watching for changes...${NC}"
    done
else
    echo "ℹ️  Install fswatch for auto-rebuild: brew install fswatch"
    echo "   For now, run manually with: ./dev-build.sh once"
fi


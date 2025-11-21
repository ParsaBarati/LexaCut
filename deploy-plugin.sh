#!/bin/bash
# Deploy the built plugin to SketchUp

echo "🚀 Deploying LexaCut Plugin to SketchUp"
echo ""

# Find the latest lexacut RBZ file
PLUGIN_FILE=$(ls -t /Volumes/Work/Code/Startups/OpenCutList/dist/lexacut-v*.rbz 2>/dev/null | head -1)
if [ -z "$PLUGIN_FILE" ]; then
    PLUGIN_FILE="/Volumes/Work/Code/Startups/OpenCutList/dist/lexacut-v8.0.15.rbz"
fi
SKETCHUP_PLUGINS="$HOME/Library/Application Support/SketchUp 2025/SketchUp/Plugins"

if [ ! -f "$PLUGIN_FILE" ]; then
    echo "❌ Plugin file not found: $PLUGIN_FILE"
    echo "Run: cd /Volumes/Work/Code/Startups/OpenCutList/build && gulp"
    exit 1
fi

echo "📦 Found plugin: $PLUGIN_FILE"
echo "📁 Target: $SKETCHUP_PLUGINS"
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
echo "📂 Extracting to temp: $TEMP_DIR"

cd "$TEMP_DIR"
unzip -q "$PLUGIN_FILE"

if [ ! -f "lexacut.rb" ]; then
    echo "❌ Failed to extract plugin"
    exit 1
fi

echo "✅ Extracted successfully"
echo ""
echo "🗑️  Removing old plugin files..."

# Remove old files
rm -rf "$SKETCHUP_PLUGINS/ladb_lexacut"
rm -f "$SKETCHUP_PLUGINS/lexacut.rb"

echo "📋 Copying new files..."

# Copy new files
cp -R ladb_lexacut "$SKETCHUP_PLUGINS/"
cp lexacut.rb "$SKETCHUP_PLUGINS/"

echo "✅ Files copied successfully"
echo ""
echo "🧹 Cleaning up..."
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Close SketchUp completely"
echo "   2. Reopen SketchUp"
echo "   3. Open plugin: Extensions → LexaCut → LexaCut"
echo ""
echo "⚠️  You MUST restart SketchUp for JavaScript changes to take effect."


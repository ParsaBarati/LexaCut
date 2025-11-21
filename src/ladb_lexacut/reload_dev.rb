# Development reload script for LexaCut
# Run this in SketchUp's Ruby Console to reload the plugin without restarting
#
# Usage in Ruby Console:
#   load '/Volumes/Work/Code/Startups/OpenCutList/src/ladb_lexacut/reload_dev.rb'

puts "🔄 Reloading LexaCut plugin..."
puts ""

# Get the correct paths
plugin_dir = File.dirname(__FILE__)
src_dir = File.dirname(plugin_dir)
main_plugin_file = File.join(src_dir, 'lexacut.rb')

unless File.exist?(main_plugin_file)
  puts "❌ Could not find plugin file: #{main_plugin_file}"
  puts "Please make sure you're running this from the correct location."
  return false
end

# Step 1: Try to close any open dialogs
begin
  if defined?(Ladb::LexaCut::Plugin)
    # The Plugin class is not a singleton, so we need to find active instances
    # Instead, just close all HTML dialogs that might be ours
    if defined?(UI::HtmlDialog)
      # Can't easily enumerate dialogs, so just note it
      puts "ℹ️  If the plugin dialog is open, please close it manually first"
    end
  end
rescue => e
  puts "⚠️  Note: #{e.message}"
end

# Step 2: Clear loaded modules
removed_count = 0
$LOADED_FEATURES.delete_if do |path|
  if path.include?('ladb_lexacut') || path.include?('ladb_opencutlist') || path.include?('lexacut')
    removed_count += 1
    true
  else
    false
  end
end
puts "✓ Cleared #{removed_count} cached Ruby files"

# Step 3: Remove constants to allow redefinition
begin
  Object.send(:remove_const, :Ladb) if defined?(Ladb)
  puts "✓ Removed Ladb module constant"
rescue => e
  puts "⚠️  Could not remove constant: #{e.message}"
end

# Step 4: Reload the main plugin file
puts ""
puts "📦 Loading plugin from: #{main_plugin_file}"
puts ""

begin
  load main_plugin_file
  puts "✅ LexaCut reloaded successfully!"
  puts ""
  puts "📋 Next steps:"
  puts "  1. Open the plugin: Extensions → LexaCut → LexaCut"
  puts "  2. Test your changes"
  puts "  3. To reload again, run this script again"
  puts ""
  puts "💡 Tip: Keep this command handy in the Ruby Console:"
  puts "   load '/Volumes/Work/Code/Startups/OpenCutList/src/ladb_lexacut/reload_dev.rb'"
  puts ""
  true
rescue => e
  puts "❌ Error reloading plugin!"
  puts ""
  puts "Error: #{e.message}"
  puts ""
  puts "Backtrace:"
  puts e.backtrace.first(10).join("\n")
  puts ""
  puts "💡 This usually means:"
  puts "  - A syntax error in your Ruby code"
  puts "  - A missing 'require' statement"
  puts "  - A problem with the plugin structure"
  puts ""
  false
end


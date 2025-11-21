#!/bin/bash
# Quick development commands for LexaCut testing

cat << 'EOF'
╔════════════════════════════════════════════════════════════════════╗
║              LexaCut Development Quick Commands                     ║
╚════════════════════════════════════════════════════════════════════╝

📦 BUILD & DEPLOY:
  ./dev-build.sh once          Build and deploy plugin to SketchUp
  ./dev-build.sh               Watch mode (auto-rebuild on changes)

🧪 TEST BACKEND (NO SKETCHUP NEEDED):
  cd api && npm test           Run all 53 unit tests
  ./test-cost-api.sh           Test API with curl
  cd api && npm run start:dev  Start API server

🔄 HOT RELOAD IN SKETCHUP:
  1. Open Ruby Console (Extensions → Developer → Ruby Console)
  2. Run: load '/Volumes/Work/Code/Startups/OpenCutList/src/ladb_lexacut/reload_dev.rb'
  3. Reopen plugin dialog

🐛 DEBUG:
  Check API:     curl http://localhost:4492/api/v1/calculate/health
  Check logs:    Ladb::LexaCut::VERBOSE = true
  Browser console: Right-click dialog → Inspect Element

⚡ SPEED TIPS:
  • Test backend first (2-3 sec)
  • Use hot reload for Ruby changes (10 sec)
  • Only restart SketchUp if absolutely necessary (2+ min)

📝 WORKFLOW:
  1. Make changes in your editor
  2. Run: cd api && npm test
  3. If tests pass, hot reload in SketchUp
  4. Test in plugin dialog

EOF

echo ""
echo "💡 For detailed instructions, see: DEVELOPMENT_TESTING_GUIDE.md"


# LexaCut Plugin - Rapid Development & Testing Guide

This guide shows you how to test the plugin efficiently without constantly restarting SketchUp.

## 🚀 Quick Start Testing Workflows

### Method 1: Ruby Console Hot Reload (Recommended)

**Best for:** Quick UI/logic changes without rebuilding

1. **Open SketchUp** (just once!)
2. **Open Ruby Console**: `Extensions → Developer → Ruby Console`
3. **Make your code changes** in your editor
4. **Run this in Ruby Console:**
   ```ruby
   load '/Volumes/Work/Code/Startups/OpenCutList/src/ladb_lexacut/reload_dev.rb'
   ```
   
   **OR use this one-liner (faster to paste):**
   ```ruby
   $LOADED_FEATURES.delete_if{|f|f.include?('ladb_lexacut')||f.include?('lexacut')}; Object.send(:remove_const,:Ladb) rescue nil; load('/Volumes/Work/Code/Startups/OpenCutList/src/lexacut.rb'); puts "✅ Reloaded!"
   ```

5. **Reopen the plugin**: `Extensions → LexaCut → LexaCut`
6. **Test your changes**

**Pros:** 
- ✅ No SketchUp restart needed
- ✅ Instant feedback (10 seconds)
- ✅ Keeps your test model open
- ✅ Works for Ruby logic changes

**Cons:** 
- ⚠️ Must manually reopen the plugin dialog
- ⚠️ Some deep initialization changes may still require restart
- ⚠️ JavaScript/CSS changes need a rebuild first

---

### Method 2: Test API Backend Only (No SketchUp!)

**Best for:** Testing Cost Analysis calculations

1. **Start the API server:**
   ```bash
   cd /Volumes/Work/Code/Startups/OpenCutList/api
   npm run start:dev
   ```

2. **Run the test script:**
   ```bash
   cd /Volumes/Work/Code/Startups/OpenCutList
   ./test-cost-api.sh
   ```

3. **Or run unit tests:**
   ```bash
   cd api
   npm test
   ```

**Pros:**
- ✅ No SketchUp needed at all!
- ✅ Tests run in seconds
- ✅ 53 comprehensive tests
- ✅ Can test with curl/Postman

**Cons:**
- ⚠️ Doesn't test UI integration

---

### Method 3: Auto-Build & Deploy

**Best for:** Testing after making JavaScript/CSS changes

1. **Build and deploy once:**
   ```bash
   cd /Volumes/Work/Code/Startups/OpenCutList
   ./dev-build.sh once
   ```

2. **Or watch for changes (requires fswatch):**
   ```bash
   brew install fswatch  # One-time install
   ./dev-build.sh        # Watches for changes
   ```

3. **In SketchUp Ruby Console:**
   ```ruby
   load '/Volumes/Work/Code/Startups/OpenCutList/src/ladb_lexacut/reload_dev.rb'
   ```

**Pros:**
- ✅ Handles JS/CSS changes
- ✅ Auto-deploys to SketchUp plugins folder
- ✅ Watch mode for continuous development

**Cons:**
- ⚠️ Still need to reload in SketchUp

---

## 📋 Testing Checklist

### Before Opening SketchUp:

- [ ] Run backend tests: `cd api && npm test`
- [ ] Start API server: `cd api && npm run start:dev`
- [ ] Test API endpoint: `./test-cost-api.sh`
- [ ] Verify no TypeScript errors: `cd api && npm run build`

### In SketchUp (Once):

- [ ] Open a test model with parts
- [ ] Generate cutlist in Parts tab
- [ ] Click "Cost Analysis" button
- [ ] Test calculation with various inputs
- [ ] Check browser console (right-click → Inspect) for errors

### For Each Code Change:

```ruby
# Run in Ruby Console:
load '/Volumes/Work/Code/Startups/OpenCutList/src/ladb_lexacut/reload_dev.rb'
```

Then reopen the plugin dialog and test.

---

## 🐛 Debugging Tips

### Check API Connection:
```ruby
# In SketchUp Ruby Console:
require 'net/http'
uri = URI('http://localhost:4492/api/v1/calculate/health')
response = Net::HTTP.get(uri)
puts response  # Should show: {"status":"ok","version":"1.0.0"}
```

### Check Plugin Logs:
```ruby
# Enable verbose logging:
Ladb::LexaCut::VERBOSE = true
```

### Test Cost Calculation Directly:
```bash
# Use curl to test the endpoint:
curl -X POST http://localhost:4492/api/v1/calculate/direct \
  -H "Content-Type: application/json" \
  -d @test-payload.json | jq
```

### Check What's Loaded:
```ruby
# In Ruby Console:
$LOADED_FEATURES.grep(/lexacut/)  # See loaded files
defined?(Ladb::LexaCut::Plugin)   # Check if plugin is loaded
```

---

## ⚡ Speed Optimization Strategies

### 1. Test Backend First (Fastest)
```bash
# 2-3 seconds total
cd api && npm test -- cost-calculation
```

### 2. Test API Endpoint (5 seconds)
```bash
./test-cost-api.sh
```

### 3. Hot Reload in SketchUp (10 seconds)
```ruby
load '/path/to/reload_dev.rb'
```

### 4. Full Rebuild (30-60 seconds)
```bash
./dev-build.sh once
# Then reload in SketchUp
```

### 5. Full SketchUp Restart (Last Resort - 2+ minutes)
Only needed for deep changes to plugin initialization.

---

## 🎯 Common Scenarios

### Scenario: Changed Cost Calculation Logic
1. ✅ Run: `cd api && npm test`
2. ✅ Test: `./test-cost-api.sh`
3. ✅ Hot reload in SketchUp if needed

**Time: 5-10 seconds**

### Scenario: Changed UI Text/Layout
1. ✅ Rebuild: `cd build && npm run build`
2. ✅ Hot reload: `load 'reload_dev.rb'` in Ruby Console
3. ✅ Reopen dialog

**Time: 30 seconds**

### Scenario: Changed JavaScript Logic
1. ✅ Rebuild: `./dev-build.sh once`
2. ✅ Hot reload in SketchUp
3. ✅ Hard refresh dialog (Cmd+R in dialog)

**Time: 40 seconds**

### Scenario: Added New Ruby File
1. ❌ **Must restart SketchUp** (sorry!)
2. But only once - then use hot reload for changes

**Time: 2 minutes (one time)**

---

## 📊 Testing Coverage

We now have **53 automated tests** covering:
- ✅ MaterialsService (95% coverage)
- ✅ CostCalculationService (81% coverage)
- ✅ PricingService (97% coverage)
- ✅ Fittings calculation
- ✅ Plate calculation
- ✅ WoodTools calculation
- ✅ Integration tests

Run all tests:
```bash
cd api && npm test -- --coverage
```

---

## 💡 Pro Tips

1. **Keep SketchUp open** with a test model loaded
2. **Keep the API server running** in a terminal
3. **Use hot reload** for 90% of changes
4. **Test API first** before testing in SketchUp
5. **Watch the browser console** in the plugin dialog (right-click → Inspect)
6. **Use the Ruby Console** as your best friend

---

## 🆘 When Things Go Wrong

### Plugin Won't Load After Reload:
```ruby
# Force complete reload:
Object.send(:remove_const, :Ladb) rescue nil
$LOADED_FEATURES.delete_if { |f| f.include?('lexacut') }
load '/Volumes/Work/Code/Startups/OpenCutList/src/lexacut.rb'
```

### API Not Responding:
```bash
# Restart API server:
cd api
npm run start:dev
```

### Changes Not Showing:
1. Check if you saved the file
2. Check if build completed successfully
3. Try hard refresh (Cmd+R) in dialog
4. Check Ruby Console for errors

---

## Summary

**Fastest → Slowest Testing Methods:**

1. 🥇 **Backend tests**: `npm test` (2-3 sec)
2. 🥈 **API curl test**: `./test-cost-api.sh` (5 sec)
3. 🥉 **Hot reload**: Ruby Console reload (10 sec)
4. 🎖️ **Auto build**: `./dev-build.sh once` (30 sec)
5. 🏁 **Full restart**: Close/open SketchUp (2+ min)

**Use hot reload for 90% of changes, only restart SketchUp when absolutely necessary!**


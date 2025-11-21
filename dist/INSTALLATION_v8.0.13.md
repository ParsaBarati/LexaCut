# LexaCut v8.0.13 - Cost Analysis Integration

## 🎉 What's New

This version adds the **Cost Analysis** feature for real-time cost calculation!

### New Features

1. **Cost Analysis Tab** (NEW!)
   - Calculate project costs directly in SketchUp
   - No CSV export needed
   - Instant feedback with financial breakdown
   - Enabled by default

2. **Optimized CSV Export**
   - Streamlined column format for backend
   - Better compatibility with cost calculation API
   - Backward compatible with legacy format

3. **Dual Workflow Support**
   - **Quick**: Direct API integration (new)
   - **Traditional**: CSV export → Admin panel import

## 📦 Installation

### Uninstall Previous Version First

1. Open SketchUp
2. Go to **Window → Extension Manager**
3. Find "LexaCut" in the list
4. Click **Uninstall**
5. Restart SketchUp

### Install v8.0.13

1. Open SketchUp
2. Go to **Window → Extension Manager**
3. Click **Install Extension**
4. Select: `lexacut-v8.0.13.rbz`
5. Click **Yes** to confirm
6. Restart SketchUp

## 🚀 Using Cost Analysis

### Prerequisites
Backend API must be running:
```bash
cd api
npm run start:dev
```

### Steps
1. Open **LexaCut** extension
2. Generate cutlist in **Parts** tab
3. Switch to **Cost Analysis** tab (new!)
4. Fill project info:
   - Project Name
   - Client Name
   - Waste Percentage
5. Click **"Calculate Cost"**
6. View cost breakdown instantly! 💰

## 📊 Cost Breakdown Includes

- Materials Cost
- CNC Operations
- Edge Banding
- Fittings & Hardware
- Overheads (configurable)
- Profit Margin
- **Final Price** ready for quotes

## 🔧 Configuration

Cost Analysis is **enabled by default** and connects to `http://localhost:4492`.

**Optional: Change API URL**
```bash
# macOS/Linux
export COST_API_URL=http://your-server:4492

# Windows
set COST_API_URL=http://your-server:4492
```

**Optional: Disable Feature**
```bash
# macOS/Linux
export COST_API_ENABLED=false

# Windows
set COST_API_ENABLED=false
```

## 🆘 Troubleshooting

**Cost Analysis tab not showing?**
1. Check API is running: Open browser to `http://localhost:4492/api/docs`
2. Verify in SketchUp Ruby Console:
   ```ruby
   Ladb::LexaCut::COST_API_ENABLED  # Should be true
   Ladb::LexaCut::COST_API_URL      # Should be "http://localhost:4492"
   ```

**Connection failed?**
- Ensure backend API is running
- Check firewall isn't blocking port 4492
- Restart SketchUp after starting API

## 📝 Alternative: CSV Workflow

If API is not available, you can still:
1. Export CSV from LexaCut
2. Upload to Admin Panel
3. Calculate costs in web interface

Both workflows work with the same backend!

## 🔗 Resources

- **Quick Start**: See `COST_ANALYSIS_QUICKSTART.md`
- **Full Documentation**: See `COST_ANALYSIS_INTEGRATION.md`
- **API Docs**: http://localhost:4492/api/docs

---

**Version**: 8.0.13  
**Build Date**: November 21, 2024  
**Build File**: `lexacut-v8.0.13.rbz`


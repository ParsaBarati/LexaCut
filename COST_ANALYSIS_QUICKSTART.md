# Quick Start - LexaCut Cost Analysis

## 🚀 Instant Setup (2 Steps!)

### 1. Start the Backend API
```bash
cd api
npm run start:dev
```

The API will start on `http://localhost:4492`

### 2. Launch SketchUp
That's it! The Cost Analysis tab is **enabled by default**.

## ✅ Using Cost Analysis

1. Open **LexaCut** extension in SketchUp
2. Go to **Parts** tab → Click **Generate**
3. Switch to **Cost Analysis** tab
4. Fill in:
   - Project Name
   - Client Name  
   - Waste Percentage (default: 15%)
5. Click **Calculate Cost**
6. View your cost breakdown! 💰

## 📊 What You Get

- **Materials Cost** - Automatic material pricing
- **CNC Operations** - Based on part complexity
- **Edge Banding** - Per edge calculations
- **Fittings** - Hardware costs
- **Financial Summary** - With overheads & profit margin
- **Final Price** - Ready for client quotes

## 🔧 Configuration (Optional)

Cost Analysis is **enabled by default** and connects to `http://localhost:4492`.

To customize (only if needed):

**macOS/Linux:**
```bash
export COST_API_URL=http://your-server:4492  # Custom URL
export COST_API_ENABLED=false                # Disable feature
```

**Windows:**
```cmd
set COST_API_URL=http://your-server:4492
set COST_API_ENABLED=false
```

## 📝 CSV Export (Alternative Workflow)

Don't want to use the direct integration? You can still:

1. **Export** from LexaCut → Save CSV
2. Go to **Admin Panel** → Upload CSV
3. Calculate costs in the web interface

Both workflows use the same backend!

## 🆘 Troubleshooting

**Cost Analysis tab not showing?**
- Check API is running: `curl http://localhost:4492/api/docs`
- Verify in SketchUp Ruby Console:
  ```ruby
  Ladb::LexaCut::COST_API_ENABLED  # Should be true
  ```

**Connection failed?**
- Make sure backend is running
- Check firewall isn't blocking port 4492
- Verify API URL in constants

## 📚 Full Documentation

See `COST_ANALYSIS_INTEGRATION.md` for complete details on:
- Architecture & data flow
- API endpoints
- Advanced configuration
- Development setup

## 🎉 That's It!

No complex setup. No environment variables. Just start the API and go!


# 🧪 Testing UI - Quick Start Guide

## Test UI Created: `test-ui.html`

Beautiful, simple interface to test your Cost Calculation API!

## 🚀 How to Use

### Step 1: Start the API
```bash
cd /Volumes/Work/Code/Startups/OpenCutList/api
npm run start:dev
```

Wait for: `🚀 Application is running on: http://localhost:3000`

### Step 2: Open the Test UI
```bash
open /Volumes/Work/Code/Startups/OpenCutList/test-ui.html
```

Or simply **double-click** the `test-ui.html` file in Finder.

### Step 3: Upload CSV and Test
1. **Select your CSV file** (333_clean.csv or any CSV in the same format)
2. **Fill in project details**:
   - Project Name: "Kitchen Cabinet"
   - Client Name: "John Doe"
   - Contract Date: 2024-01-15 (pre-filled with today)
   - Waste Percentage: 0.15 (15% waste)
3. **Click "💰 Calculate Cost"**
4. **View beautiful results!**

## 📊 What You'll See

### Results Display:
✅ **Project Information** - Name, client, date  
✅ **Cost Breakdown** - All 8 categories in cards:
   - Material
   - BoreshKari (Cutting)
   - CNC
   - NavarShiar (Edge Banding)
   - Fittings
   - Painting
   - Plate
   - WoodTools

✅ **Financial Summary** - All overheads shown:
   - Overhead 1 (25%)
   - Overhead 2 (4%)
   - Overhead 3 (2%)
   - Overhead 4 (2%)
   - Contingency (2.5%)
   - Total Overheads
   - Profit (22%)

✅ **Final Price** - Big, prominent display with ریال formatting  
✅ **Full JSON** - Toggle to view complete API response

## 🎨 UI Features

- 🎨 Beautiful gradient purple design
- 📤 Drag & drop file upload
- ⚡ Real-time calculation
- 💰 Persian Rial formatting (with thousand separators)
- 📱 Responsive design
- ⚠️ Error handling with clear messages
- ⏳ Loading indicator
- 🔍 JSON viewer (toggleable)

## 📁 Test with Sample Data

Use the extracted `333_clean.csv`:
```bash
cd /Volumes/Work/Code/Startups/OpenCutList/excel_extract_env
# Upload this file in the UI: 333_clean.csv
```

Sample data:
```csv
Length - raw,Width - raw,Quantity,Material name,Designation,Area - final
60.0,20.0,3,ام دی اف,Component#2,0.12 m²
```

## 🔍 Expected Results

For the sample data above:
- **Material Cost**: Based on MDF pricing × 0.36 m² (0.12 × 3)
- **BoreshKari**: Cutting costs based on perimeter
- **Final Price**: All costs + overheads + 22% profit

## 🐛 Troubleshooting

### API Not Running?
```bash
cd /Volumes/Work/Code/Startups/OpenCutList/api
npm run start:dev
```

### CORS Issues?
The API has CORS enabled for `*` (all origins) in development.

### File Upload Not Working?
- Ensure your CSV has the correct headers
- Check browser console (F12) for error details
- Verify API is running on port 3000

## 🎉 Success!

When everything works, you'll see:
- ✅ Beautiful cost breakdown cards
- ✅ All overhead calculations displayed
- ✅ Final price prominently shown
- ✅ Full JSON response available

**Ready to test!** Open the HTML file and start uploading CSVs! 🚀


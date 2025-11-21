# 🎯 Quick Start Guide: Using the Cost Calculator

## Access the Calculator

You can access the calculator in **3 ways**:

### 1. Featured Banner (Recommended)
- Open the admin panel dashboard
- Click the large **blue-purple gradient banner** at the top
- Says "Cost Calculator - Upload CSV files and calculate project costs instantly"

### 2. Quick Actions
- Scroll to "Quick Actions" section on dashboard
- Click the **first card** with the Calculator icon
- Has a special gradient design

### 3. Sidebar Navigation
- Look at the left sidebar menu
- Click **"Calculator"** (second item, after Dashboard)
- Available from any page

## Using the Calculator

### Step 1: Upload CSV File
1. Click the upload area or drag & drop your file
2. Supports `.csv` and `.xlsx` files
3. Use the test files in `/test-cases/` folder

### Step 2: Fill Project Information
- **Project Name**: e.g., "Kitchen Cabinet Project"
- **Client Name**: e.g., "John Doe"
- **Contract Date**: Auto-filled with today's date (editable)
- **Waste Percentage**: Default 0.15 (15%) - adjust as needed

### Step 3: Calculate
1. Click the **"Calculate Cost"** button
2. Wait for processing (usually 1-2 seconds)
3. See detailed results below

## Understanding the Results

### 1. Project Information
Shows your input data (name, client, date)

### 2. Cost Breakdown (8 Categories)
- **Material**: Raw material costs
- **BoreshKari**: Cutting services
- **CNC**: CNC machining operations
- **NavarShiar**: Edge banding
- **Fittings**: Hardware and fittings
- **Painting**: Painting costs
- **Plate**: Plate materials
- **WoodTools**: Wood tools and accessories

### 3. Financial Summary
- **Subtotal**: Sum of all category costs
- **Overhead 1 (25%)**: First overhead calculation
- **Overhead 2 (4%)**: Second overhead
- **Overhead 3 (2%)**: Third overhead
- **Overhead 4 (2%)**: Fourth overhead
- **Contingency (2.5%)**: Contingency buffer
- **Total Overheads**: Sum of all overheads
- **Total with Overheads**: Subtotal + Overheads
- **Profit (22%)**: Profit margin

### 4. Final Price
Large, prominent display of the **total project cost** in Rials

### 5. JSON Response (Optional)
- Click "Full JSON Response" to see raw API data
- Useful for debugging or integration

## Sample Test Files

Use these test files located in `/test-cases/`:

1. **test-case-1-single-material.csv** - Simple single material project
2. **test-case-2-multiple-materials.csv** - Multiple materials
3. **test-case-3-edge-banding.csv** - With edge banding
4. **test-case-4-cnc-components.csv** - With CNC operations
5. **test-case-5-complex.csv** - Complex project
6. **test-case-6-edge-cases.csv** - Edge cases testing

## Example Calculation Flow

```
1. Upload "test-case-5-complex.csv"
2. Enter:
   - Project: "Luxury Kitchen"
   - Client: "Ahmad Rezai"
   - Date: 2025-11-21
   - Waste: 0.15

3. Click Calculate

4. See Results:
   Material:     45,000,000 Rials
   CNC:           3,500,000 Rials
   Edge Banding:  2,100,000 Rials
   Fittings:      5,200,000 Rials
   ... other categories ...
   
   Subtotal:     65,000,000 Rials
   Overheads:    22,750,000 Rials
   Profit:       19,305,000 Rials
   
   FINAL PRICE: 107,055,000 Rials
```

## Tips

- ✅ Use correct CSV format (see test files for examples)
- ✅ Make sure API is running on port 4492
- ✅ Check that database has pricing data
- ✅ Adjust waste percentage based on project needs
- ✅ Save/screenshot results for records

## Troubleshooting

### "Calculation failed" error
- Check API is running: `http://localhost:4492`
- Verify CSV file format
- Check browser console for details

### Empty or zero costs
- Verify database has pricing data
- Check material codes match database codes
- Ensure CSV has correct column structure

### Upload not working
- Try different file format (.csv vs .xlsx)
- Check file size (should be reasonable)
- Refresh the page and try again

## URLs

- **Admin Panel**: http://localhost:5173
- **Calculator**: http://localhost:5173/calculator
- **API**: http://localhost:4492
- **API Docs**: http://localhost:4492/api

---

**Ready to calculate?** Open http://localhost:5173 and click the Calculator banner! 🚀


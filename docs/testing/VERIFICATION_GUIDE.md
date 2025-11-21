# Verification Guide - Testing Excel Parsing & Calculations

## Quick Test

### Step 1: Run the Test Script
```bash
cd api
node test-parsing.js
```

This will show you:
- ✅ If Excel file can be read
- ✅ Column mapping verification
- ✅ Unit conversions (cm → mm)
- ✅ Area calculations
- ✅ Expected cost calculations

### Step 2: Test via API

1. **Start the server:**
```bash
cd api
npm run start:dev
```

2. **Open test-ui.html** in your browser

3. **Upload `333.csv.xlsx`** file

4. **Check the browser console** for:
   - Parsed components
   - Material lookups
   - Cost calculations

## Expected Results for 333.csv.xlsx

### Input Data:
- **Length**: 60 cm
- **Width**: 20 cm  
- **Quantity**: 3 pieces
- **Material**: ام دی اف (MDF)
- **Area**: 0.12 m² per piece

### Expected Parsed Values:
- **Length**: 600 mm (60 cm × 10)
- **Width**: 200 mm (20 cm × 10)
- **Quantity**: 3
- **Material Type**: "ام دی اف" → Should match "MDF" in pricing table
- **Area**: 0.12 m²

### Expected Calculations:

#### Material Cost:
- **Total Area**: 0.12 m² × 3 pieces = **0.36 m²**
- **Material Price**: 125,000 Rials/m² (MDF 18mm)
- **Material Cost**: 0.36 × 125,000 = **45,000 Rials**

#### Other Costs (will be calculated):
- BoreshKari (Cutting): Based on edges
- CNC: Based on instance type
- NavarShiar (Edge Banding): Based on edge properties
- Fittings: Based on component count
- Painting: Based on area
- Plate: Based on area
- WoodTools: Based on area

## Verification Checklist

### ✅ Parsing Verification:
- [ ] Excel file is detected (not treated as CSV)
- [ ] Sheet is read correctly
- [ ] Columns are mapped correctly:
  - [ ] Length: 60 cm → 600 mm
  - [ ] Width: 20 cm → 200 mm
  - [ ] Quantity: 3
  - [ ] Material: "ام دی اف" is found
  - [ ] Area: "0.12 m²" → 0.12

### ✅ Material Lookup Verification:
- [ ] Material "ام دی اف" matches "MDF" in pricing table
- [ ] Material description is found
- [ ] Material price is found (125,000 Rials/m²)

### ✅ Cost Calculation Verification:
- [ ] Material cost = 45,000 Rials
- [ ] Total area = 0.36 m²
- [ ] Total quantity = 3

### ✅ Financial Summary Verification:
- [ ] Subtotal includes all cost categories
- [ ] Overheads are calculated
- [ ] Profit is added (22%)
- [ ] Final price is reasonable

## Debugging Tips

### Check Server Logs:
Look for these log messages:
```
Detected Excel file, parsing with xlsx...
Reading sheet: Sheet1
Excel parsing: Read X rows from sheet
Valid component: { name: ..., material: ..., length: 600, width: 200, ... }
MaterialsService: Processing material "ام دی اف" with area 0.36m²
```

### Check API Response:
The response should include:
```json
{
  "costs": {
    "material": {
      "totalCost": 45000,
      "totalArea": 0.36,
      "totalQuantity": 3,
      "items": [
        {
          "cost": 45000,
          "description": "MDF 18mm",
          "quantity": 0.36,
          "code": "ام دی اف"
        }
      ]
    }
  }
}
```

## Common Issues

### Issue: All costs are 0
**Solution**: Check if material lookup is working. Material name might not match.

### Issue: Wrong area calculation
**Solution**: Verify unit conversion (cm → mm) is correct.

### Issue: Material not found
**Solution**: Check if Persian material name matches pricing table.

### Issue: Excel file not parsed
**Solution**: Verify file is actually .xlsx format, not renamed CSV.

## Manual Calculation Reference

For the test file (333.csv.xlsx):
- **Component**: 60cm × 20cm × 3 pieces
- **Area per piece**: 0.12 m²
- **Total area**: 0.36 m²
- **Material**: MDF 18mm @ 125,000 Rials/m²
- **Material cost**: 45,000 Rials

This is the baseline - all other costs will be added on top.


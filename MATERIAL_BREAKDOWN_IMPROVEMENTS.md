# 🔧 Material Breakdown Dialog - Data Handling Improvements

## Issues Fixed

### Before:
- ❌ All materials showing "Unknown Material"
- ❌ Unit prices showing as 0 even with total costs
- ❌ Total Area showing 0 m² despite quantities
- ❌ Missing material names and details

### After:
- ✅ Intelligent field detection from multiple possible sources
- ✅ Calculated unit prices when not provided
- ✅ Proper area/quantity display
- ✅ Fallback to numbered materials if name missing
- ✅ Debug mode to inspect raw data

## Smart Data Extraction

### Material Name Detection
Now checks multiple fields in order:
```typescript
materialName || material || name || description || materialType || "Material #1"
```

### Unit Price Calculation
If not provided directly, calculates from total:
```typescript
unitPrice = totalCost / quantity
```

### Quantity/Area Handling
Checks multiple possible fields:
```typescript
quantity || totalQuantity || 0
area || totalArea || surfaceArea || quantity
```

### Total Cost Detection
```typescript
totalCost || cost || materialCost || 0
```

## New Features Added

### 1. Category Display
Shows material category if available:
```
Code: MAT-1 | Thickness: 16 mm | Category: Panel
```

### 2. Base Cost Breakdown
If available, shows:
- Base cost (before waste)
- Waste amount and percentage

### 3. Debug Mode (Development Only)
In development mode, each material card shows:
- "Debug: Raw Data" expandable section
- Full JSON structure of the material item
- Helps identify what fields the API is actually sending

### 4. Import Format Support
Added dropdown to select CSV format:
- **Auto-detect** (Recommended) - Automatically detects format
- **LexaCut Optimized** - For files from LexaCut plugin
- **Legacy Format** - For older 333.csv files

## Data Structure Flexibility

The dialog now handles various API response structures:

### Option 1: Full detailed structure
```json
{
  "materialName": "ام دی اف 16 میل - سفید",
  "materialCode": "MAT-1",
  "thickness": 16,
  "quantity": 5.25,
  "unit": "متر مربع",
  "unitPrice": 22000000,
  "totalCost": 115500000,
  "area": 5.25,
  "category": "Panel"
}
```

### Option 2: Minimal structure
```json
{
  "material": "MDF 16mm White",
  "quantity": 5.25,
  "cost": 115500000
}
```
*The dialog will calculate unit price: 115500000 / 5.25*

### Option 3: Alternative field names
```json
{
  "name": "ام دی اف 16 میل",
  "totalQuantity": 5.25,
  "materialCost": 115500000,
  "totalArea": 5.25
}
```

## Improved Display

### Calculated Values
- ✅ Unit price auto-calculated if missing
- ✅ Area defaults to quantity if not specified
- ✅ Safe division (handles zero quantities)

### Better Formatting
- ✅ 2 decimal places for quantities
- ✅ Proper currency formatting (Rials)
- ✅ Fallback values (shows 0.00 instead of error)

### Enhanced Details
- ✅ Shows base cost if available
- ✅ Shows waste calculations separately
- ✅ Category information when present
- ✅ Component counts from multiple fields

## Testing the Fix

### To Test:
1. Upload any CSV file with materials
2. Calculate the cost
3. Click the Material card
4. Verify:
   - Material names appear correctly
   - Unit prices are shown
   - Total areas are displayed
   - All costs are accurate

### Debug Mode:
In development, expand "Debug: Raw Data" on any material to see:
- Exact fields the API is returning
- Field names and values
- Data structure

### Import Format:
After selecting a file, choose:
- **Auto-detect**: Let system detect format
- **LexaCut**: For optimized plugin exports
- **Legacy**: For old 333.csv files

## Technical Details

### Smart Field Lookup
```typescript
// Tries multiple field names
const materialName = item.materialName 
  || item.material 
  || item.name 
  || item.description
  || item.materialType
  || `Material #${index + 1}`;
```

### Safe Calculations
```typescript
// Prevents division by zero
const quantity = item.quantity || 0;
const unitPrice = quantity > 0 ? totalCost / quantity : 0;
```

### Flexible Rendering
```typescript
// Only shows sections if data exists
{(item.baseCost || item.wasteAmount) && (
  // Cost breakdown section
)}
```

## Benefits

1. **Robust**: Handles various API response formats
2. **Informative**: Shows all available data
3. **Safe**: No crashes from missing fields
4. **Developer-Friendly**: Debug mode for troubleshooting
5. **User-Friendly**: Clear, organized display
6. **Flexible**: Adapts to different data structures

---

**Status:** ✅ Fixed and Enhanced
**Date:** November 21, 2025

The material breakdown dialog now intelligently handles various data formats and calculates missing values! 🎉


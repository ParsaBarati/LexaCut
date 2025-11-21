# ✨ Material Breakdown Dialog - Feature Guide

## What's New

Added a **detailed Material Breakdown Dialog** to the Cost Calculator page that shows comprehensive information about all materials used in the project.

## How to Access

1. Calculate a project cost (upload CSV and click Calculate)
2. In the "Cost Breakdown" section, click on the **Material** card
3. The Material card now shows:
   - A small Package icon (📦)
   - "Click for details →" hint
   - Hover effect (blue border)

## Dialog Features

### Summary Section
- **Total Material Cost**: Large display of total cost in Rials
- **Total Items**: Number of different materials used

### Material Item Cards
Each material shows:

**Main Information:**
- Material name (in Persian)
- Material code
- Thickness (if applicable)
- Total cost (prominent in blue)

**Quantity Details:**
- Quantity and unit (e.g., 5.25 m²)
- Unit price (price per m²)
- Total area used

**Additional Details (when available):**
- Length (mm)
- Width (mm)
- Component count

**Waste Information:**
- Waste amount added (in Rials)
- Waste percentage applied

### Design Features

✨ **Beautiful Modal Design:**
- Dark theme matching admin panel
- Gradient header with Package icon
- Smooth backdrop blur
- Scrollable content area
- Hover effects on material cards

✨ **Responsive:**
- Works on all screen sizes
- Maximum 90% viewport height
- Scrollable content if many materials

✨ **Easy to Close:**
- X button in top-right
- "Close" button at bottom
- Click outside modal (optional enhancement)

## Example Material Card

```
┌─────────────────────────────────────────────┐
│ ام دی اف 16 میل - سفید         22,000,000 ریال│
│ Code: MAT-1  |  Thickness: 16 mm             │
├─────────────────────────────────────────────┤
│ Quantity      Unit Price      Total Area     │
│ 5.25 m²       22,000,000      5.25 m²        │
├─────────────────────────────────────────────┤
│ Length        Width           Components     │
│ 2440 mm       1220 mm         12             │
├─────────────────────────────────────────────┤
│ Waste Added: 1,650,000 (15%)                │
└─────────────────────────────────────────────┘
```

## Technical Details

### State Management
- Added `showMaterialBreakdown` state to toggle dialog
- Uses existing `result.costs.material.items` data

### Styling
- Fixed position overlay (z-50)
- Black backdrop with blur effect
- Gray-900 background for dialog
- Blue accent colors for highlights
- Smooth transitions and hover effects

### Data Structure
The dialog handles various material data formats:
```typescript
{
  materialName: string,
  materialCode: string,
  thickness: number,
  quantity: number,
  unit: string,
  unitPrice: number,
  totalCost: number,
  area: number,
  length?: number,
  width?: number,
  componentCount?: number,
  wasteAmount?: number,
  wastePercentage?: number
}
```

## Benefits

1. **Transparency**: See exactly what materials are being charged
2. **Verification**: Check quantities and prices match expectations
3. **Detail**: View component counts and dimensions
4. **Waste Tracking**: See how much waste was added to each material
5. **Professional**: Present detailed breakdowns to clients

## Future Enhancements (Optional)

- [ ] Export material list to PDF
- [ ] Sort materials by cost/name/quantity
- [ ] Filter materials by type
- [ ] Add search functionality
- [ ] Show material images/thumbnails
- [ ] Compare materials across calculations
- [ ] Material substitution suggestions

---

**Status:** ✅ Complete and Working
**Date:** November 21, 2025

Open the calculator, calculate a project, and click the Material card to see it in action! 🚀


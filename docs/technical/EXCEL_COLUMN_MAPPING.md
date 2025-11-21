# Excel Column Mapping - COMPLETE DOCUMENTATION

## Actual CSV Structure from 333.csv.xlsx

### Column Mapping

| Excel | Index | CSV Header | Type | Maps To Excel "All" Sheet | Description |
|-------|-------|------------|------|---------------------------|-------------|
| A | 0 | Length - raw | float | J (Length) | Length in cm (not mm) |
| B | 1 | Width - raw | float | K (Width) | Width in cm (not mm) |
| C | 2 | Quantity | int | C (Quantity) | Number of components |
| D | 3 | Edge Length 1 | string/null | D (Edge1) | Edge property for length side 1 |
| E | 4 | Edge Length 2 | string/null | E (Edge2) | Edge property for length side 2 |
| F | 5 | Edge Width 1 | string/null | F (Edge3) | Edge property for width side 1 |
| G | 6 | Edge Width 2 | string/null | G (Edge4) | Edge property for width side 2 |
| H | 7 | Material name | string | H (Material Type) | Material specification (e.g., "ام دی اف") |
| I | 8 | Designation | string | B (Component ID) | Component designation |
| J | 9 | Instance names | string/null | I (Instance Type) | Instance name (may contain "CNC-") |
| K | 10 | Area - final | string | L (Area) | Area with unit (e.g., "0.12 m²") |
| L | 11 | Description | string/null | A (Name) | Component description/name |

### Key Differences from Expected:

1. **Column Order**: The CSV has a different column order than expected
2. **Units**: Length/Width are in **cm** (divide by 10 to get Excel cm, divide by 100 for meters)
3. **Area Format**: Area includes unit string "m²" - needs parsing
4. **Missing Columns**: Component Name is in column L (Description), not A

### Correct Mapping for Implementation:

```typescript
interface RawCSVRow {
  'Length - raw': number;      // Column A (cm)
  'Width - raw': number;       // Column B (cm)
  'Quantity': number;          // Column C
  'Edge Length 1'?: string;    // Column D
  'Edge Length 2'?: string;    // Column E
  'Edge Width 1'?: string;     // Column F
  'Edge Width 2'?: string;     // Column G
  'Material name': string;     // Column H
  'Designation': string;       // Column I (Component ID)
  'Instance names'?: string;   // Column J (may be null)
  'Area - final': string;      // Column K (e.g., "0.12 m²")
  'Description'?: string;      // Column L (Component name)
}

// Maps to:
interface ComponentData {
  name: string;                // From CSV "Description" (L)
  componentId: string;         // From CSV "Designation" (I)
  quantity: number;            // From CSV "Quantity" (C)
  edge1?: string;              // From CSV "Edge Length 1" (D)
  edge2?: string;              // From CSV "Edge Length 2" (E)
  edge3?: string;              // From CSV "Edge Width 1" (F)
  edge4?: string;              // From CSV "Edge Width 2" (G)
  materialType: string;        // From CSV "Material name" (H)
  instanceType: string;        // From CSV "Instance names" (J)
  length: number;              // From CSV "Length - raw" (A) * 10 = mm
  width: number;               // From CSV "Width - raw" (B) * 10 = mm
  area: number;                // Parse from CSV "Area - final" (K)
}
```

### VBA Macro Processing Sequence

After CSV import to "All" sheet, the محاسبه button triggers:

1. **CopyP1()** - Copies All → P1, processes data
   - Removes "CNC-" prefix from Instance names
   - Trims whitespace
   - Calculates additional fields (BA, BB, BC columns)

2. **Material()** - Creates Pivot Table, calculates materials
   - Groups by Material Type
   - Sums areas
   - VLOOKUPs descriptions and prices
   - Outputs to Material!A31

3. **BoreshKari()** - Calculates cutting costs
   - Uses Material sheet data
   - VLOOKUPs cutting prices
   - Outputs to BoreshKari!A31

4. **CNC()** - Filters CNC components
   - Filters Instance names containing "CNC"
   - Creates Pivot Table
   - Outputs to CNC!A31

5. **NavarShiar()** - Edge banding calculations
   - Calculates perimeter based on edge flags
   - Outputs to NavarShiarFarsi!A31

6. **Fittings()** - Hardware costs
   - VLOOKUPs from FittingsData
   - Creates Pivot Table
   - Outputs to Fittings!A31

7. **Painting()** - Painting costs
   - Surface area calculations
   - Outputs to Painting!A31 (rows 7-16 and 21-30)

8. **Plate()** - Sheet material costs
   - Outputs to Plate!A31

9. **WoodTools()** - Tool costs
   - Outputs to WoodTools!A28

10. **روکش مالی** - Financial Summary
    - Gathers all A31 values
    - Applies overheads (A27-A31)
    - Calculates final price with 22% profit (A33)

### Sample Data

**Input (333.csv):**
```csv
Length - raw,Width - raw,Quantity,Edge Length 1,Edge Length 2,Edge Width 1,Edge Width 2,Material name,Designation,Instance names,Area - final,Description
60.0,20.0,3,,,,,ام دی اف,Component#2,,0.12 m²,
```

**Processed Values:**
- Length: 60 cm → 600 mm
- Width: 20 cm → 200 mm  
- Quantity: 3
- Area: 0.12 m² = 0.12
- Material: "ام دی اف" (MDF)
- Total area for material calc: 0.12 m² * 3 = 0.36 m²

**Expected Output Structure:**
```json
{
  "material": {
    "totalCost": [calculated from 0.36 m² * unit price],
    "items": [
      {
        "description": "MDF description from VLOOKUP",
        "quantity": 0.36,
        "unit": "m²",
        "cost": [calculated]
      }
    ]
  },
  "financialSummary": {
    "subtotal": [sum of all categories],
    "finalPrice": [subtotal + overheads + 22% profit]
  }
}
```

### Implementation Checklist

- ✅ CSV Parser adjusted for actual column names
- ✅ Unit conversion (cm → mm)
- ✅ Area parsing (remove "m²" suffix)
- ✅ Column mapping corrected
- ⏳ Services refactored to match VBA macros
- ⏳ Excel cell references added as comments
- ⏳ Orchestrator created matching button flow


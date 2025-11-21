# Excel Formula Reference - Complete Mapping

## Overview
This document maps every formula in ANALIZ-MALI-GHARARDAD-BIM.xlsm to its TypeScript implementation, showing exact cell references and calculation logic.

---

## Material Sheet (مواد)

### Header Formulas
| Cell | Formula | Purpose | TypeScript |
|------|---------|---------|------------|
| A1 | `=CONCATENATE(Data!$D$3,Data!$C$3)` | Sheet title | Not needed in API |
| E1 | `=CONCATENATE(Data!$D$2,Data!$C$2)` | Currency label | Persian formatting |

### Summary Formulas (Row 31)
| Cell | Formula | Purpose | TypeScript Implementation |
|------|---------|---------|---------------------------|
| **A31** | `=SUM(A7:A30)` | **Total Material Cost** | `materialCosts.totalCost` |
| **C31** | `=SUM(C7:C30)` | **Total Units** | Sum of material units |
| **E31** | `=SUM(E7:E30)` | **Total Quantity** | `materialCosts.totalQuantity` |
| **G31** | `=SUM(G7:G30)` | **Total Items** | Count of material types |

### Data Cells (A7:A30)
**Populated by VBA `Material()` macro:**
```vb
For i = 7 To Lastcount
   Sheets("Material").Cells(i, 1) = Sheets("Material").Cells(i, 6) * WorksheetFunction.Round(Sheets("Material").Cells(i, 8), 0)
Next i
```

**Formula:** `A7 = F7 × ROUND(H7, 0)`
- A7: Cost in Rials
- F7: Unit price (from VLOOKUP on W:Z)
- H7: Total area in m² (from pivot table)

**TypeScript:**
```typescript
// materials.service.ts - calculateMaterialCosts()
const cost = round(groupArea * (materialInfo.unitPrice || 0), 0);
```

**Verification:**
- Input: groupArea = 0.36 m², unitPrice = 125,000 Rials/m²
- Excel: A7 = 125000 × ROUND(0.36, 0) = 125000 × 0 = 0 ❌
- **ISSUE:** Excel rounds area before multiplication, which would give 0 for small areas
- Our TypeScript: 0.36 × 125000 = 45,000 ✅
- **ACTION:** Verify if Excel actually uses this formula or if macro does it differently

---

## BoreshKari Sheet (برش کاری)

### Header Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=CONCATENATE(Data!$D$3,Data!$C$3)` | Sheet title |
| C1 | `=CONCATENATE(Data!$D$2,Data!$C$2)` | Currency label |

### Summary Formula
| Cell | Formula | Purpose | TypeScript |
|------|---------|---------|------------|
| **A31** | `=SUM(A7:A30)` | **Total Cutting Cost** | `boreshKariCosts.totalCost` |

### Data Cells (A7:A30)
**Populated by VBA `BoreshKari()` macro:**
```vb
For i = 7 To Lastcount
   Sheets("BoreshKari").Cells(i, 1) = Sheets("BoreshKari").Cells(i, 2) * WorksheetFunction.Round(Sheets("BoreshKari").Cells(i, 4), 0)
Next i
```

**Formula:** `A7 = B7 × ROUND(D7, 0)`
- A7: Cutting cost
- B7: Unit price (from VLOOKUP on W:X)
- D7: Quantity

**TypeScript Status:** ❌ Currently not implemented (returns empty)

**Implementation Needed:**
```typescript
// cost-calculation.service.ts
private calculateBoreshKariCosts(components: ProcessedComponent[]): BoreshKariCategory {
  const items: CostItem[] = [];
  let totalCost = 0;
  
  // Get material-based cutting info from pricing lookup
  for (const component of components) {
    const cuttingInfo = this.pricingLookup.getCuttingByCode('CUT001');
    const unitPrice = cuttingInfo?.unitPrice || 2000;
    
    // Excel: B × ROUND(D, 0)
    const cost = round(unitPrice * round(component.quantity, 0), 0);
    
    items.push({
      cost,
      description: `Cutting - ${component.name}`,
      unit: 'piece',
      quantity: component.quantity,
      code: component.materialType,
    });
    
    totalCost += cost;
  }
  
  return {
    category: 'BoreshKari',
    items,
    totalCost: round(totalCost, 0),
  };
}
```

---

## CNC Sheet

### Header Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=CONCATENATE(Data!$D$3,Data!$C$3)` | Sheet title |
| D1 | `=CONCATENATE(Data!$D$2,Data!$C$2)` | Currency label |

### Summary Formula
| Cell | Formula | Purpose | TypeScript |
|------|---------|---------|------------|
| **A31** | `=SUM(A7:A30)` | **Total CNC Cost** | `cncCosts.totalCost` |

### Data Cells (A7:A30)
**Formula:** `A7 = B7 × ROUND(D7, 0)`
- A7: CNC cost
- B7: Operation price (from VLOOKUP)
- D7: Quantity (from pivot table on "All" sheet columns AQ:AR)

**TypeScript:**
```typescript
// cost-calculation.service.ts - calculateCNCCosts()
const cost = round(unitPrice * component.quantity, 0);
```

**Status:** ✅ Implemented correctly

---

## NavarShiarFarsi Sheet (نوار شیار)

### Header Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=CONCATENATE(Data!$D$3,Data!$C$3)` | Sheet title |
| D1 | `=CONCATENATE(Data!$D$2,Data!$C$2)` | Currency label |

### Summary Formula
| Cell | Formula | Purpose | TypeScript |
|------|---------|---------|------------|
| **A31** | `=SUM(A7:A30)` | **Total Edge Banding Cost** | `navarShiarCosts.totalCost` |

### Data Calculation (in "All" sheet)
**VBA calculates edge length:**
```vb
For G = LastcountALL + 1 To LastCountALL2
 Sheets("ALL").Cells(G - LastcountALL + 1, 31) = (Sheets("ALL").Cells(G, 1) * Sheets("ALL").Cells(G, 3)) / 100
Next G
```

**Formula:** `All!AE = (All!A × All!C) / 100`
- AE: Edge length in meters
- A: Length in cm
- C: Quantity

**Then copied to NavarShiarFarsi sheet and multiplied by price**

**TypeScript:**
```typescript
// cost-calculation.service.ts - calculateNavarShiarCosts()
const perimeterPerEdge = (component.length + component.width) / 1000; // mm to m
const totalLength = perimeterPerEdge * edgesToBand * component.quantity;
const cost = round(totalLength * unitPrice, 0);
```

**Discrepancy:** 
- Excel: `(Length × Quantity) / 100`
- TypeScript: `((Length + Width) × edgesToBand × Quantity) / 1000`
- **ACTION:** Verify which formula is correct

---

## Fittings Sheet (یراق آلات)

### Header Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=CONCATENATE(Data!$D$3,Data!$C$3)` | Sheet title |
| D1 | `=CONCATENATE(Data!$D$2,Data!$C$2)` | Currency label |

### Summary Formula
| Cell | Formula | Purpose | TypeScript |
|------|---------|---------|------------|
| **A31** | `=SUM(A7:A30)` | **Total Fittings Cost** | `fittingsCosts.totalCost` |

**TypeScript Status:** ❌ Currently not implemented (returns empty)

**Note:** Uses pivot table "FittingsTable" on "FittingsData" sheet

---

## Painting Sheet (رنگ)

### Header Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=Fittings!A1` | Copy title from Fittings |
| E1 | `=CONCATENATE(Data!$C$12,Data!$B$12)` | Currency label |
| F1 | `=CONCATENATE(Data!$D$2,Data!$C$2)` | Unit label |

### Summary Formulas
| Cell | Formula | Purpose | TypeScript |
|------|---------|---------|------------|
| A17 | `=SUM(A7:A16)` | Subtotal | Painting category subtotal |
| **A31** | `=SUM(A21:A30)` | **Total Painting Cost** | `paintingCosts.totalCost` |

**TypeScript Status:** ⚠️ Partial implementation

---

## Plate Sheet (صفحه)

### Header Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=CONCATENATE(Data!$D$3,Data!$C$3)` | Sheet title |
| C1 | `=CONCATENATE(Data!$D$2,Data!$C$2)` | Currency label |

### Summary Formula
| Cell | Formula | Purpose | TypeScript |
|------|---------|---------|------------|
| **A31** | `=SUM(A7:A30)` | **Total Plate Cost** | `plateCosts.totalCost` |

**TypeScript Status:** ⚠️ Partial implementation

---

## WoodTools Sheet (ابزار چوبی)

### Header Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=Plate!A1` | Copy title from Plate |
| E1 | `=Plate!C1` | Copy currency label |

### Summary Formula
| Cell | Formula | Purpose | TypeScript |
|------|---------|---------|------------|
| **A28** | Likely `=SUM(A7:A27)` | **Total WoodTools Cost** | `woodToolsCosts.totalCost` |

**Note:** A28 is used instead of A31 (referenced in روکش مالی!A13)

**TypeScript Status:** ⚠️ Partial implementation

---

## روکش مالی Sheet (Financial Summary)

### Header Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=WoodTools!A1` | Sheet title |
| B1 | `=WoodTools!E1` | Currency label |

### Category Cost References
| Cell | Formula | Description | TypeScript Field |
|------|---------|-------------|------------------|
| **A7** | `=Material!A31` | Material costs | `breakdown.material` |
| **A8** | `=BoreshKari!A31` | Cutting costs | `breakdown.boreshKari` |
| **A9** | `=NavarShiarFarsi!A31` | Edge banding costs | `breakdown.navarShiar` |
| **A10** | `=CNC!A31` | CNC costs | `breakdown.cnc` |
| **A11** | `=Fittings!A31` | Fittings costs | `breakdown.fittings` |
| **A12** | `=Painting!A31` | Painting costs | `breakdown.painting` |
| **A13** | `=WoodTools!A28` | Wood tools costs | `breakdown.woodTools` |
| **A14** | `=Plate!A31` | Plate costs | `breakdown.plate` |

### Overhead Calculations
| Cell | Formula | Description | TypeScript Implementation |
|------|---------|-------------|---------------------------|
| **A27** | `=SUM(A7:A26)*0.25` | Overhead 1 (25%) | `subtotal * 0.25` |
| **A28** | `=SUM(A7:A26)*0.04` | Overhead 2 (4%) | `subtotal * 0.04` |
| **A29** | `=SUM(A7:A26)*0.02` | Overhead 3 (2%) | `subtotal * 0.02` |
| **A30** | `=SUM(A7:A26)*0.02` | Overhead 4 (2%) | `subtotal * 0.02` |
| **A31** | `=SUM(A7:A26)*0.025` | Contingency (2.5%) | `subtotal * 0.025` |

**TypeScript:**
```typescript
// pricing.service.ts - calculateFinancialSummary()
const subtotal = sum(Object.values(breakdown));
const overhead1 = subtotal * pricingConfig.overhead1;     // 0.25
const overhead2 = subtotal * pricingConfig.overhead2;     // 0.04
const overhead3 = subtotal * pricingConfig.overhead3;     // 0.02
const overhead4 = subtotal * pricingConfig.overhead4;     // 0.02
const contingency = subtotal * pricingConfig.contingency; // 0.025
```

**Status:** ✅ Correctly implemented

### Final Price Calculations
| Cell | Formula | Description | TypeScript |
|------|---------|-------------|------------|
| **A32** | `=SUM(A7:A26)+SUM(A27:A31)` | Total with overheads | `totalWithOverheads` |
| **A33** | `=A32+(A32*0.22)` | Final price (with 22% profit) | `finalPrice` |

**Simplified A32:** `=SUM(A7:A26) + SUM(A27:A31)`
- First SUM: All category costs (A7:A26)
- Second SUM: All overhead costs (A27:A31)

**TypeScript:**
```typescript
const totalWithOverheads = subtotal + totalOverheads;
const profitAmount = totalWithOverheads * 0.22;
const finalPrice = totalWithOverheads + profitAmount;
```

**Status:** ✅ Correctly implemented

---

## P1 Sheet (Intermediate Processing)

### Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=Material!A1` | Copy Material sheet title |
| I1 | `=Material!E1` | Copy Material currency label |

**Note:** P1 sheet is primarily populated by VBA `CopyP1()` macro, not formulas

---

## قرار داد Sheet (Contract)

### Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A1 | `=Plate!A1` | Sheet title |
| J1 | `=A1` | Copy title |
| W2 | `=Data!C2` | Contract number |
| **W6** | `='روکش مالی'!A33` | **Final price reference** |
| A8 | `=W3` | Project name |
| F8 | `=W2` | Contract number |
| G9 | `=W4` | Client name |
| F12 | `=W5` | Date |
| B16 | `=W6` | Final price display |
| O26 | `=W2` | Contract number |

**Key:** Cell W6 references the final calculated price from روکش مالی!A33

---

## مالی Sheet (Financial)

### Formulas
| Cell | Formula | Purpose |
|------|---------|---------|
| A5 | `=B5` | Copy value |
| B5 | `='روکش مالی'!A34` | Reference to summary (A34 not shown in our extract) |
| A20 | `=A19` | Copy value |

---

## برشکاری Sheet (Additional Cutting)

### Formulas (Row 18-23)
Pattern: `M[row] = M[row] - L[row] - J[row] - H[row] - F[row] - D[row] - B[row]`

**Example:** `M18 = M8 - L8 - J8 - H8 - F8 - D8 - B8`

**Purpose:** Calculate remaining/difference values

---

## Summary of Key Formulas

### Total Cost Flow:
```
Material!A31 → روکش مالی!A7
BoreshKari!A31 → روکش مالی!A8
NavarShiarFarsi!A31 → روکش مالی!A9
CNC!A31 → روکش مالی!A10
Fittings!A31 → روکش مالی!A11
Painting!A31 → روکش مالی!A12
WoodTools!A28 → روکش مالی!A13
Plate!A31 → روکش مالی!A14
        ↓
روکش مالی!SUM(A7:A26) = Subtotal
        ↓
A27-A31: Overheads (25%, 4%, 2%, 2%, 2.5%)
        ↓
A32: Subtotal + Overheads
        ↓
A33: A32 + (A32 × 0.22) = Final Price
        ↓
قرار داد!W6 → Contract display
```

### Critical Formula Patterns:

1. **Cost Calculation:** `Cost = UnitPrice × ROUND(Quantity, 0)`
2. **Subtotals:** `A31 = SUM(A7:A30)`
3. **Overheads:** `A[27-31] = SUM(A7:A26) × percentage`
4. **Final Price:** `A33 = A32 + (A32 × 0.22)`

---

## Implementation Status by Sheet

| Sheet | Formula Count | TypeScript Status | Notes |
|-------|---------------|-------------------|-------|
| Material | 4 | ✅ Implemented | Verify ROUND behavior |
| BoreshKari | 2 | ❌ Not implemented | Need to add logic |
| CNC | 2 | ✅ Implemented | Working correctly |
| NavarShiarFarsi | 2 | ⚠️ Partial | Verify formula |
| Fittings | 2 | ❌ Not implemented | Need pivot logic |
| Painting | 3 | ⚠️ Partial | Basic implementation |
| Plate | 2 | ⚠️ Partial | Basic implementation |
| WoodTools | 2 | ⚠️ Partial | Uses A28 not A31 |
| روکش مالی | 10 | ✅ Implemented | All formulas correct |
| قرار داد | 9 | N/A | Display only |

---

## Action Items

1. ❌ **Implement BoreshKari calculations**
2. ❌ **Implement Fittings with pivot table logic**
3. ⚠️ **Verify NavarShiar formula** - Excel vs TypeScript difference
4. ⚠️ **Verify ROUND behavior** in Material cost calculation
5. ⚠️ **Complete Painting, Plate, WoodTools** implementations
6. ✅ **Financial summary formulas** - all correct


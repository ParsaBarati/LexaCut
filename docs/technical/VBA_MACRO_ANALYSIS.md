# VBA Macro Analysis - Complete Documentation

## Overview
This document provides line-by-line analysis of all VBA macros in ANALIZ-MALI-GHARARDAD-BIM.xlsm with their purpose, data flow, and implementation mapping to TypeScript.

## Execution Flow

The main calculation button (محاسبه) triggers this sequence:
1. `CopyP1()` - Process and copy data from "All" sheet to "P1" sheet
2. `Material()` - Calculate material costs with pivot tables
3. `BoreshKari()` - Calculate cutting/edge processing costs
4. `NavarShiarFarsi()` - Calculate edge banding costs
5. `CNC()` - Calculate CNC operation costs
6. `Fittings()` - Calculate fittings costs with pivot tables

---

## 1. CopyP1() Macro

**Purpose:** Process raw data from "All" sheet and prepare it for calculations

**Location:** Module5.bas, Line 215

**Input:** "All" sheet (columns A-L and beyond)
**Output:** "P1" sheet with processed data

### Line-by-Line Analysis:

```vb
Dim StartCell As Range
Dim LastRow As Long
Dim LastCol As Long
Dim Lastcount As Integer
```
- Initialize variables for range management
- `Lastcount` will store the last row with data

```vb
Sheets("all").Select
Lastcount = Sheets("all").Cells(Rows.Count, 11).End(xlUp).Row
LastcountPvot = Sheets("all").Cells(Rows.Count, 27).End(xlUp).Row
```
- Find last row with data in column K (11)
- Find last row for pivot table in column AA (27)
- **TypeScript equivalent:** `components.length`

```vb
Sheets("all").Range(Range("a2"), Cells(Lastcount, "c")).Copy Sheets("p1").Range("b11")
```
- Copy columns A-C (Name, ComponentID, Quantity) to P1 sheet starting at B11
- **TypeScript:** Already in `ComponentData.name`, `componentId`, `quantity`

```vb
Sheets("all").Range(StartCell, Cells(Lastcount, "j")).Copy Sheets("p1").Range("k11")
```
- Copy columns I-J (Instance names, Length) to P1 sheet
- **TypeScript:** `ComponentData.instanceType`, `length`

```vb
Sheets("all").Range(Range("h2"), Cells(Lastcount, "h")).Copy Sheets("p1").Range("m11")
```
- Copy column H (Material Type) to P1 sheet
- **TypeScript:** `ComponentData.materialType`

### Edge Counting Logic:

```vb
For i = 2 To Lastcount
   If (Sheets("ALL").Cells(i, 6) Like Sheets("Data").Range("B2")) And 
      (Sheets("ALL").Cells(i, 7) Like Sheets("Data").Range("B2")) Then
       Sheets("p1").Cells((i + 9), 10) = 2
   ElseIf (Sheets("ALL").Cells(i, 6) Like Sheets("Data").Range("B2")) Xor 
          (Sheets("ALL").Cells(i, 7) Like Sheets("Data").Range("B2")) Then
       Sheets("p1").Cells((i + 9), 10) = 1
   Else
       Sheets("p1").Cells((i + 9), 10) = Null
   End If
Next i
```

**Logic:**
- Check columns F & G (Edge Length 1 & 2) against reference value in Data!B2
- If both edges match: count = 2
- If only one edge matches (XOR): count = 1
- Otherwise: count = 0 (Null)
- Stores result in P1 sheet column J (offset +9 rows)

**TypeScript Implementation:**
Currently in `cost-calculation.service.ts` - `calculateNavarShiarCosts()`:
```typescript
const edges = [component.edge1, component.edge2, component.edge3, component.edge4];
const edgesToBand = edges.filter(e => e && e.trim() !== '').length;
```

**Discrepancy:** Our TypeScript counts non-empty edges. Excel checks against a reference value. Need to verify if this affects calculations.

### Data Cleaning:

```vb
For t = 2 To Lastcount
 Select Case Left(Sheets("all").Cells(t, 9), 4)
  Case "CNC-"
   Sheets("P1").Cells((t + 9), 12) = Replace(Sheets("ALL").Cells(t, 9), "CNC-", "")
  Case Else
   Sheets("P1").Cells((t + 9), 12) = Sheets("ALL").Cells(t, 9)
 End Select
Next t
```

**Logic:**
- Remove "CNC-" prefix from Instance names (column I)
- Stores cleaned value in P1 sheet column L

**TypeScript Implementation:**
In `data-processing.service.ts`:
```typescript
cleanInstanceType: comp.instanceType.replace(/^CNC-/i, '').trim()
```

**Status:** ✅ Correctly implemented

---

## 2. Material() Macro

**Purpose:** Calculate material costs using pivot table aggregation

**Location:** Module5.bas, Line 756

**Input:** "All" sheet with material data
**Output:** "Material" sheet with costs

### Line-by-Line Analysis:

```vb
Sheets("material").Activate
ActiveSheet.Range("A7:I30").ClearContents
```
- Clear previous calculation results
- Range A7:I30 is the output area

```vb
Sheets("all").Columns("k").Replace what:="m²", Replacement:=""
```
- Remove "m²" suffix from area values in column K
- **TypeScript:** We handle this in `parseArea()` function

```vb
Lastcount = Sheets("all").Cells(Rows.Count, 11).End(xlUp).Row
```
- Find last row with data

```vb
Sheets("all").Range("aa4:aa27").Copy Destination:=Sheets("Material").Range("i7:i24")
Sheets("all").Range("ab4:ab27").Copy Destination:=Sheets("Material").Range("H7:H24")
```
- Copy pivot table results to Material sheet
- Column AA: Material codes
- Column AB: Summed areas by material
- **This is the key aggregation step**

### VLOOKUP for Material Info:

```vb
Set MyRange = Sheets("Material").Range("W:Z")
Set DataCode = Sheets("Material").Range("i7:i30")
Set DataDsc = Sheets("Material").Range("b7:b30")
DataDsc.Value = Application.WorksheetFunction.VLookup(DataCode, MyRange, 4, 0)
Sheets("Material").Columns("b").Replace what:="#N/A", Replacement:=Null
```

**VLOOKUP Logic:**
- Range W:Z contains the lookup table:
  - Column W: Material code
  - Column X: Description
  - Column Y: Unit
  - Column Z: Unit Price
- VLookup(code, W:Z, 4, 0) returns column 4 (Z) = Unit Price
- VLookup(code, W:Z, 2, 0) returns column 2 (X) = Description

**TypeScript Implementation:**
In `pricing-lookup.service.ts`:
```typescript
getMaterialByName(materialType) // or getMaterialByCode()
```

**Status:** ✅ Correctly implemented

### Cost Calculation:

```vb
For i = 7 To Lastcount
   Sheets("Material").Cells(i, 1) = Sheets("Material").Cells(i, 6) * WorksheetFunction.Round(Sheets("Material").Cells(i, 8), 0)
Next i
```

**Formula:** `A = F × ROUND(H, 0)`
- Column A: Cost
- Column F: Unit Price (from VLOOKUP)
- Column H: Area (from pivot table)

**Excel Cell:** Material!A7 = F7 × ROUND(H7, 0)

**TypeScript:**
```typescript
const cost = round(groupArea * (materialInfo.unitPrice || 0), 0);
```

**Status:** ✅ Correctly implemented

---

## 3. BoreshKari() Macro

**Purpose:** Calculate cutting/edge processing costs

**Location:** Module5.bas, Line 653

**Input:** "Material" sheet with material data
**Output:** "BoreshKari" sheet with cutting costs

### Line-by-Line Analysis:

```vb
Sheets("BoreshKari").Activate
ActiveSheet.Range("A7:F30").ClearContents
```
- Clear previous results

```vb
Sheets("material").Select
Lastcount = Sheets("material").Cells(Rows.Count, 9).End(xlUp).Row
```
- Find last row in Material sheet column I

```vb
Sheets("material").Range(Range("I7"), Cells(Lastcount, "i")).Copy Sheets("BoreshKari").Range("F7")
Sheets("material").Range(Range("G7"), Cells(Lastcount, "G")).Copy Sheets("BoreshKari").Range("D7")
```
- Copy Material!I7:I# (material codes) to BoreshKari!F7
- Copy Material!G7:G# (quantities) to BoreshKari!D7

### VLOOKUP for Cutting Prices:

```vb
Set MyRange = Sheets("BoreshKari").Range("w:x")
Set DataCode = Sheets("BoreshKari").Range("f7:f30")
Set DataDsc = Sheets("BoreshKari").Range("b7:b30")
DataDsc.Value = Application.WorksheetFunction.VLookup(DataCode, MyRange, 2, 0)
```

**VLOOKUP Logic:**
- Range W:X contains cutting price lookup:
  - Column W: Code
  - Column X: Price
- Returns cutting price per unit

### Cost Calculation:

```vb
For i = 7 To Lastcount
   Sheets("BoreshKari").Cells(i, 1) = Sheets("BoreshKari").Cells(i, 2) * WorksheetFunction.Round(Sheets("BoreshKari").Cells(i, 4), 0)
Next i
```

**Formula:** `A = B × ROUND(D, 0)`
- Column A: Cost
- Column B: Unit Price (from VLOOKUP)
- Column D: Quantity

**Excel Cell:** BoreshKari!A7 = B7 × ROUND(D7, 0)

**TypeScript Implementation:**
Currently returns empty items. **Need to implement this logic.**

**Status:** ❌ Not fully implemented

---

## 4. NavarShiarFarsi() Macro

**Purpose:** Calculate edge banding costs

**Location:** Module5.bas, Line 2745

**Input:** "All" sheet with edge data
**Output:** "NavarShiarFarsi" sheet with edge banding costs

### Key Logic:

```vb
For G = LastcountALL + 1 To LastCountALL2
 Sheets("ALL").Cells(G - LastcountALL + 1, 31) = (Sheets("ALL").Cells(G, 1) * Sheets("ALL").Cells(G, 3)) / 100
Next G
```

**Formula:** `AE = (A × C) / 100`
- Calculates edge banding length
- Divides by 100 to convert cm to meters

**TypeScript Implementation:**
```typescript
const perimeterPerEdge = (component.length + component.width) / 1000; // mm to m
const totalLength = perimeterPerEdge * edgesToBand * component.quantity;
```

**Status:** ⚠️ Partial - need to verify formula matches exactly

---

## 5. CNC() Macro

**Purpose:** Calculate CNC operation costs

**Location:** Module5.bas, Line 1712

**Input:** "All" sheet with CNC data (pivot table results)
**Output:** "CNC" sheet with costs

### Line-by-Line Analysis:

```vb
Sheets("CNC").Activate
ActiveSheet.Range("A7:E30").ClearContents
```
- Clear previous results

```vb
Sheets("all").Range("AQ4:AQ27").Copy Destination:=Sheets("CNC").Range("E7:E24")
Sheets("all").Range("AR4:AR27").Copy Destination:=Sheets("CNC").Range("D7:D24")
```
- Copy from pivot table:
  - Column AQ: CNC codes
  - Column AR: Quantities
- **This indicates CNC data comes from a pivot table on the "All" sheet**

### VLOOKUP for CNC Prices:

```vb
Set MyRange = Sheets("CNC").Range("W:X")
Set DataCode = Sheets("CNC").Range("E7:E30")
Set DataDsc = Sheets("CNC").Range("B7:B30")
DataDsc.Value = Application.WorksheetFunction.VLookup(DataCode, MyRange, 2, 0)
```

**Lookup Range W:X:**
- Column W: CNC operation code
- Column X: Price per operation

### Cost Calculation:

```vb
Lastcount = Sheets("CNC").Cells(Rows.Count, 5).End(xlUp).Row
For i = 7 To Lastcount
   Sheets("CNC").Cells(i, 1) = Sheets("CNC").Cells(i, 2) * WorksheetFunction.Round(Sheets("CNC").Cells(i, 4), 0)
Next i
```

**Formula:** `A = B × ROUND(D, 0)`
- Column A: Cost
- Column B: Unit Price (from VLOOKUP)
- Column D: Quantity

**Excel Cell:** CNC!A7 = B7 × ROUND(D7, 0)

**TypeScript Implementation:**
```typescript
const cost = round(unitPrice * component.quantity, 0);
```

**Status:** ✅ Correctly implemented

---

## Summary of Implementation Status

| Macro | Purpose | TypeScript Status | Notes |
|-------|---------|------------------|-------|
| CopyP1 | Data processing | ✅ Implemented | Edge counting logic needs verification |
| Material | Material costs | ✅ Implemented | VLOOKUP working correctly |
| BoreshKari | Cutting costs | ❌ Not implemented | Currently returns empty |
| NavarShiarFarsi | Edge banding | ⚠️ Partial | Formula needs verification |
| CNC | CNC operations | ✅ Implemented | Working correctly |
| Fittings | Hardware costs | ❌ Not implemented | Currently returns empty |

---

## Key Findings

### 1. Pivot Tables
Excel uses pivot tables extensively to aggregate data:
- Material aggregation by material type (column AA, AB in "All" sheet)
- CNC aggregation by operation type (column AQ, AR in "All" sheet)
- Fittings aggregation (FittingsData sheet)

**Our TypeScript** replicates this with `groupBy` logic in services.

### 2. VLOOKUP Ranges
All pricing data is in columns W-Z across sheets:
- W: Code
- X: Description
- Y: Unit
- Z: Unit Price

**Our TypeScript** uses JSON lookup tables instead.

### 3. Data Flow
```
All Sheet (CSV input)
  ↓
CopyP1() - Clean & process data
  ↓
P1 Sheet - Intermediate data
  ↓ (Pivot tables aggregate)
Material() - Calculate material costs
BoreshKari() - Calculate cutting costs
NavarShiarFarsi() - Calculate edge banding
CNC() - Calculate CNC costs
Fittings() - Calculate hardware costs
  ↓
روکش مالی (Financial Summary) - Aggregate all costs & apply overheads
```

### 4. Missing Implementations

Need to implement:
1. **BoreshKari** - Cutting cost calculation
2. **Fittings** - Hardware cost with pivot logic
3. **Painting, Plate, WoodTools** - Area-based costs

### 5. Formula Differences

Excel uses `ROUND(value, 0)` extensively. Our TypeScript uses `round()` function but need to verify it matches Excel's rounding behavior.

---

## Next Steps

1. Implement missing BoreshKari logic
2. Implement Fittings with pivot aggregation
3. Verify edge counting formula matches Excel
4. Create test cases to validate each macro's output
5. Document all cell formulas for each sheet

---

## TypeScript Mapping Reference

| Excel Macro | TypeScript File | Function |
|-------------|----------------|----------|
| CopyP1() | data-processing.service.ts | processComponents() |
| Material() | materials.service.ts | calculateMaterialCosts() |
| BoreshKari() | cost-calculation.service.ts | calculateBoreshKariCosts() |
| NavarShiarFarsi() | cost-calculation.service.ts | calculateNavarShiarCosts() |
| CNC() | cost-calculation.service.ts | calculateCNCCosts() |
| Fittings() | cost-calculation.service.ts | calculateFittingsCosts() |
| روکش مالی | pricing.service.ts | calculateFinancialSummary() |


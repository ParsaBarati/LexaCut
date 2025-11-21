# Test Cases - Expected Results

## Overview
This document defines expected results for all test cases, calculated manually based on Excel formulas.

---

## Test Case 1: Single Material, No Edges

**Input File:** `test-case-1-single-material.csv`

### Input Data:
- **Component:** Single MDF Panel
- **Dimensions:** 60cm × 20cm
- **Quantity:** 1 piece
- **Material:** ام دی اف (MDF)
- **Edges:** None
- **Area:** 0.12 m²

### Expected Calculations:

#### Material Cost:
```
Area per piece: 0.12 m²
Quantity: 1
Total area: 0.12 × 1 = 0.12 m²
MDF unit price: 125,000 Rials/m²
Material cost: 0.12 × 125,000 = 15,000 Rials
```

#### Other Costs:
```
BoreshKari: 0 (no edges)
NavarShiar: 0 (no edges)
CNC: 0 (no CNC in instance name)
Fittings: 0
Painting: 0
Plate: 0
WoodTools: 0
```

#### Financial Summary:
```
Subtotal: 15,000 Rials
Overhead1 (25%): 15,000 × 0.25 = 3,750 Rials
Overhead2 (4%): 15,000 × 0.04 = 600 Rials
Overhead3 (2%): 15,000 × 0.02 = 300 Rials
Overhead4 (2%): 15,000 × 0.02 = 300 Rials
Contingency (2.5%): 15,000 × 0.025 = 375 Rials
Total Overheads: 5,325 Rials
Total with Overheads: 15,000 + 5,325 = 20,325 Rials
Profit (22%): 20,325 × 0.22 = 4,472 Rials (rounded)
Final Price: 20,325 + 4,472 = 24,797 Rials
```

### Expected JSON:
```json
{
  "costs": {
    "material": {
      "totalCost": 15000,
      "totalArea": 0.12,
      "totalQuantity": 1
    }
  },
  "financialSummary": {
    "subtotal": 15000,
    "overheads": {
      "overhead1": 3750,
      "overhead2": 600,
      "overhead3": 300,
      "overhead4": 300,
      "contingency": 375,
      "totalOverheads": 5325
    },
    "totalWithOverheads": 20325,
    "profitAmount": 4472,
    "finalPrice": 24797
  }
}
```

---

## Test Case 2: Multiple Materials

**Input File:** `test-case-2-multiple-materials.csv`

### Input Data:
- **Component 1:** MDF Panel (60×20cm, qty 2)
- **Component 2:** Melamine Panel (80×30cm, qty 1)
- **Component 3:** Particle Board Panel (50×40cm, qty 3)

### Expected Calculations:

#### Material Cost:
```
MDF:
  Area: 0.12 m² × 2 = 0.24 m²
  Price: 0.24 × 125,000 = 30,000 Rials

Melamine:
  Area: 0.24 m² × 1 = 0.24 m²
  Price: 0.24 × 145,000 = 34,800 Rials

Particle Board:
  Area: 0.20 m² × 3 = 0.60 m²
  Price: 0.60 × 95,000 = 57,000 Rials

Total Material: 30,000 + 34,800 + 57,000 = 121,800 Rials
```

#### Financial Summary:
```
Subtotal: 121,800 Rials
Overhead1 (25%): 121,800 × 0.25 = 30,450 Rials
Overhead2 (4%): 121,800 × 0.04 = 4,872 Rials
Overhead3 (2%): 121,800 × 0.02 = 2,436 Rials
Overhead4 (2%): 121,800 × 0.02 = 2,436 Rials
Contingency (2.5%): 121,800 × 0.025 = 3,045 Rials
Total Overheads: 43,239 Rials
Total with Overheads: 165,039 Rials
Profit (22%): 165,039 × 0.22 = 36,309 Rials (rounded)
Final Price: 165,039 + 36,309 = 201,348 Rials
```

---

## Test Case 3: Edge Banding Scenarios

**Input File:** `test-case-3-edge-banding.csv`

### Input Data:
- **Component 1:** MDF (60×20cm, qty 1, 2 edges - Length sides)
- **Component 2:** Melamine (80×30cm, qty 1, 2 edges - Width sides)
- **Component 3:** MDF (50×40cm, qty 2, 4 edges - All sides)
- **Component 4:** Plywood (100×50cm, qty 1, 1 edge)

### Expected Calculations:

#### Material Cost:
```
MDF (Comp 1): 0.12 × 1 = 0.12 m² × 125,000 = 15,000 Rials
Melamine (Comp 2): 0.24 × 1 = 0.24 m² × 145,000 = 34,800 Rials
MDF (Comp 3): 0.20 × 2 = 0.40 m² × 125,000 = 50,000 Rials
Plywood (Comp 4): 0.50 × 1 = 0.50 m² × 180,000 = 90,000 Rials

Total Material: 15,000 + 34,800 + 50,000 + 90,000 = 189,800 Rials
```

#### Edge Banding Cost (NavarShiar):
```
Component 1 (2 edges on length):
  Perimeter = (600 + 200) / 1000 = 0.8 m
  Length = 0.8 × 2 edges × 1 qty = 1.6 m
  Cost = 1.6 × 3,500 = 5,600 Rials

Component 2 (2 edges on width):
  Perimeter = (800 + 300) / 1000 = 1.1 m
  Length = 1.1 × 2 edges × 1 qty = 2.2 m
  Cost = 2.2 × 3,500 = 7,700 Rials

Component 3 (4 edges):
  Perimeter = (500 + 400) / 1000 = 0.9 m
  Length = 0.9 × 4 edges × 2 qty = 7.2 m
  Cost = 7.2 × 3,500 = 25,200 Rials

Component 4 (1 edge):
  Perimeter = (1000 + 500) / 1000 = 1.5 m
  Length = 1.5 × 1 edge × 1 qty = 1.5 m
  Cost = 1.5 × 3,500 = 5,250 Rials

Total NavarShiar: 5,600 + 7,700 + 25,200 + 5,250 = 43,750 Rials
```

#### Financial Summary:
```
Subtotal: 189,800 + 43,750 = 233,550 Rials
Overhead1 (25%): 233,550 × 0.25 = 58,387.5 Rials
Overhead2 (4%): 233,550 × 0.04 = 9,342 Rials
Overhead3 (2%): 233,550 × 0.02 = 4,671 Rials
Overhead4 (2%): 233,550 × 0.02 = 4,671 Rials
Contingency (2.5%): 233,550 × 0.025 = 5,838.75 Rials
Total Overheads: 82,910.25 Rials
Total with Overheads: 316,460.25 Rials
Profit (22%): 316,460.25 × 0.22 = 69,621.26 Rials
Final Price: 386,081.51 Rials
```

---

## Test Case 4: CNC Components

**Input File:** `test-case-4-cnc-components.csv`

### Input Data:
- **Component 1:** MDF with CNC-Drill (qty 3)
- **Component 2:** Melamine with CNC-Route, 2 edges (qty 2)
- **Component 3:** MDF regular (qty 1)

### Expected Calculations:

#### Material Cost:
```
MDF (Comp 1): 0.12 × 3 = 0.36 m² × 125,000 = 45,000 Rials
Melamine (Comp 2): 0.24 × 2 = 0.48 m² × 145,000 = 69,600 Rials
MDF (Comp 3): 0.20 × 1 = 0.20 m² × 125,000 = 25,000 Rials

Total Material: 139,600 Rials
```

#### CNC Cost:
```
Component 1 (CNC-Drill):
  Quantity: 3
  Price: 5,000 Rials/piece (CNC001)
  Cost: 3 × 5,000 = 15,000 Rials

Component 2 (CNC-Route):
  Quantity: 2
  Price: 12,000 Rials/piece (CNC002 - Routing)
  Cost: 2 × 12,000 = 24,000 Rials

Total CNC: 39,000 Rials
```

#### Edge Banding:
```
Component 2 only has edges:
  Perimeter = (800 + 300) / 1000 = 1.1 m
  Length = 1.1 × 2 edges × 2 qty = 4.4 m
  Cost = 4.4 × 3,500 = 15,400 Rials
```

#### Financial Summary:
```
Subtotal: 139,600 + 39,000 + 15,400 = 194,000 Rials
Overhead1 (25%): 194,000 × 0.25 = 48,500 Rials
Overhead2 (4%): 194,000 × 0.04 = 7,760 Rials
Overhead3 (2%): 194,000 × 0.02 = 3,880 Rials
Overhead4 (2%): 194,000 × 0.02 = 3,880 Rials
Contingency (2.5%): 194,000 × 0.025 = 4,850 Rials
Total Overheads: 68,870 Rials
Total with Overheads: 262,870 Rials
Profit (22%): 262,870 × 0.22 = 57,831.4 Rials
Final Price: 320,701.4 Rials
```

---

## Test Case 5: Complex Multi-Scenario

**Input File:** `test-case-5-complex.csv`

### Input Data:
5 components with various materials, edges, and CNC operations

### Expected Calculations:

#### Material Cost:
```
MDF: (0.12 × 3) + (0.72 × 2) = 1.8 m² × 125,000 = 225,000 Rials
Melamine: 0.24 × 2 = 0.48 m² × 145,000 = 69,600 Rials
Particle Board: 0.20 × 4 = 0.80 m² × 95,000 = 76,000 Rials
Plywood: 0.50 × 1 = 0.50 m² × 180,000 = 90,000 Rials

Total Material: 460,600 Rials
```

#### Edge Banding:
```
Comp 1 (2 edges): 0.8 × 2 × 3 = 4.8 m × 3,500 = 16,800 Rials
Comp 2 (4 edges): 1.1 × 4 × 2 = 8.8 m × 3,500 = 30,800 Rials
Comp 3 (2 edges): 0.9 × 2 × 4 = 7.2 m × 3,500 = 25,200 Rials
Comp 4 (4 edges): 1.5 × 4 × 1 = 6.0 m × 3,500 = 21,000 Rials

Total NavarShiar: 93,800 Rials
```

#### CNC Cost:
```
Comp 1 (CNC-Drill): 3 × 5,000 = 15,000 Rials
Comp 2 (CNC-Route): 2 × 12,000 = 24,000 Rials
Comp 4 (CNC-Complex): 1 × 15,000 = 15,000 Rials

Total CNC: 54,000 Rials
```

#### Financial Summary:
```
Subtotal: 460,600 + 93,800 + 54,000 = 608,400 Rials
Overhead1 (25%): 608,400 × 0.25 = 152,100 Rials
Overhead2 (4%): 608,400 × 0.04 = 24,336 Rials
Overhead3 (2%): 608,400 × 0.02 = 12,168 Rials
Overhead4 (2%): 608,400 × 0.02 = 12,168 Rials
Contingency (2.5%): 608,400 × 0.025 = 15,210 Rials
Total Overheads: 215,982 Rials
Total with Overheads: 824,382 Rials
Profit (22%): 824,382 × 0.22 = 181,364.04 Rials
Final Price: 1,005,746.04 Rials
```

---

## Test Case 6: Edge Cases

**Input File:** `test-case-6-edge-cases.csv`

### Input Data:
- **Row 1:** Empty row (should be filtered out)
- **Row 2:** Very large panel (1000×500cm = 5 m²)
- **Row 3:** Very small panel with high quantity (5×2cm, qty 100)
- **Row 4:** Unknown material (should use fallback pricing)

### Expected Calculations:

#### Parsing:
```
Row 1: Should be filtered (quantity = 0, dimensions = 0)
Rows 2-4: Should be parsed successfully
Valid components: 3
```

#### Material Cost:
```
Large MDF: 5.0 × 1 = 5.0 m² × 125,000 = 625,000 Rials
Small Melamine: 0.001 × 100 = 0.1 m² × 145,000 = 14,500 Rials
Unknown Material: 0.12 × 1 = 0.12 m² × 125,000 (default MDF) = 15,000 Rials

Total Material: 654,500 Rials
```

#### Edge Banding:
```
Row 2 (4 edges, large): 
  Perimeter = (10000 + 5000) / 1000 = 15 m
  Length = 15 × 4 × 1 = 60 m
  Cost = 60 × 3,500 = 210,000 Rials

Total NavarShiar: 210,000 Rials
```

#### Financial Summary:
```
Subtotal: 654,500 + 210,000 = 864,500 Rials
Overhead1 (25%): 864,500 × 0.25 = 216,125 Rials
Overhead2 (4%): 864,500 × 0.04 = 34,580 Rials
Overhead3 (2%): 864,500 × 0.02 = 17,290 Rials
Overhead4 (2%): 864,500 × 0.02 = 17,290 Rials
Contingency (2.5%): 864,500 × 0.025 = 21,612.5 Rials
Total Overheads: 307,297.5 Rials
Total with Overheads: 1,171,797.5 Rials
Profit (22%): 1,171,797.5 × 0.22 = 257,795.45 Rials
Final Price: 1,429,592.95 Rials
```

---

## Validation Checklist

For each test case, verify:

### Parsing:
- [ ] Correct number of components parsed
- [ ] Empty rows filtered out
- [ ] Dimensions converted correctly (cm → mm)
- [ ] Area parsed correctly (m²)
- [ ] Material names matched correctly

### Material Costs:
- [ ] Materials grouped correctly
- [ ] Area aggregation correct
- [ ] Unit prices looked up correctly
- [ ] Total cost = area × unit price

### Edge Banding:
- [ ] Edges counted correctly
- [ ] Perimeter calculated: (L + W) / 1000
- [ ] Total length = perimeter × edges × quantity
- [ ] Cost = length × 3,500 Rials/m

### CNC Costs:
- [ ] CNC components filtered correctly
- [ ] "CNC-" prefix removed
- [ ] Cost = quantity × 5,000 Rials

### Financial Summary:
- [ ] Subtotal = sum of all categories
- [ ] Each overhead calculated correctly
- [ ] Total overheads = sum(A27:A31)
- [ ] Total with overheads = subtotal + overheads
- [ ] Profit = total × 0.22
- [ ] Final price = total + profit

---

## Running Tests

### Manual Testing:
1. Start API: `cd api && npm run start:dev`
2. Open `test-ui.html`
3. Upload each test CSV file
4. Compare results with expected values above
5. Check formulas display section

### Automated Testing Script:
```bash
# For each test case:
curl -X POST http://localhost:3000/api/v1/calculate/csv \
  -F "file=@test-cases/test-case-1-single-material.csv" \
  -F 'projectData={"name":"Test 1","client":"Test","date":"2025-11-21"}'
```

### Verification Script:
```javascript
// Compare actual vs expected
const testResults = {
  testCase1: {
    expected: { finalPrice: 24797 },
    actual: { finalPrice: actualResult.financialSummary.finalPrice },
    pass: Math.abs(expected.finalPrice - actual.finalPrice) < 1
  }
};
```

---

## Quick Reference: Expected Final Prices

| Test Case | Description | Expected Final Price |
|-----------|-------------|----------------------|
| 1 | Single material, no edges | 24,797 Rials |
| 2 | Multiple materials | 201,348 Rials |
| 3 | Edge banding scenarios | 386,081.51 Rials |
| 4 | CNC components | 320,701.4 Rials |
| 5 | Complex multi-scenario | 1,005,746.04 Rials |
| 6 | Edge cases (large/small) | 1,429,592.95 Rials |

---

## Notes

1. **Rounding:** Excel uses `ROUND(value, 0)` which rounds to nearest integer. Our calculations should match exactly.

2. **Unit Conversions:**
   - Length/Width: cm → mm (× 10)
   - Area: mm² → m² (÷ 1,000,000)
   - Edge length: mm → m (÷ 1,000)

3. **Material Matching:**
   - "ام دی اف" → MDF (125,000 Rials/m²)
   - "ملامین" → Melamine (145,000 Rials/m²)
   - "نئوپان" → Particle Board (95,000 Rials/m²)
   - "تخته" → Plywood (180,000 Rials/m²)
   - Unknown → Fallback to MDF (125,000 Rials/m²)

4. **Tolerance:** Allow ±1 Rial difference due to rounding


import { CalculationResult, MaterialCategory, CNCCategory, FittingsCategory } from '../../common/interfaces';

/**
 * Expected calculation results for test fixtures
 * Based on actual pricing from pricing-tables.json
 */

/**
 * Expected material cost for simple door (2 units of 0.24 m²)
 * Using MDF 16mm price: 22,000,000 Rials/m²
 * Calculation: 0.48 m² × 22,000,000 = 10,560,000 Rials
 */
export const expectedDoorMaterialCost = {
  totalCost: 10560000,
  totalArea: 0.48,
  totalQuantity: 1,
};

/**
 * Expected CNC cost for hood panel (1 unit with complex operation)
 * Using CNC-Complex price: ~500,000-1,000,000 Rials per piece
 * Calculation: 500,000 × 1 = 500,000 Rials
 */
export const expectedCNCCost = {
  totalCost: 500000,
  itemCount: 1,
};

/**
 * Expected fittings cost for door (2 hinges per door)
 * Hinge price: 200,000 Rials
 * Calculation: 200,000 × 2 × 2 doors = 800,000 Rials
 */
export const expectedDoorFittingsCost = {
  totalCost: 800000,
  itemCount: 1, // One fitting type
};

/**
 * Expected drawer fittings (rails + handle)
 * Rails 50cm: 700,000 Rials/pair
 * Handle: 450,000 Rials
 * Calculation: (700,000 + 450,000) × 3 = 3,450,000 Rials
 */
export const expectedDrawerFittingsCost = {
  totalCost: 3450000,
  itemCount: 2, // Rails and handle
};

/**
 * Expected WoodTools base cost
 * Base: 500,000 Rials
 * 1 CNC component: 20,000 Rials
 * Total: 520,000 Rials
 */
export const expectedWoodToolsCost = {
  baseCost: 500000,
  cncCost: 20000,
  totalCost: 520000,
};

/**
 * Expected financial summary percentages
 */
export const expectedOverheadPercentages = {
  overhead1: 0.25,  // 25%
  overhead2: 0.04,  // 4%
  overhead3: 0.02,  // 2%
  overhead4: 0.02,  // 2%
  contingency: 0.025, // 2.5%
  profitMargin: 0.22, // 22%
};

/**
 * Example: For subtotal of 10,000,000 Rials
 */
export const exampleFinancialSummary = {
  subtotal: 10000000,
  overheads: {
    overhead1: 2500000,  // 10M × 0.25
    overhead2: 400000,   // 10M × 0.04
    overhead3: 200000,   // 10M × 0.02
    overhead4: 200000,   // 10M × 0.02
    contingency: 250000, // 10M × 0.025
    totalOverheads: 3550000, // Sum
  },
  totalWithOverheads: 13550000, // 10M + 3.55M
  profitAmount: 2981000,        // 13.55M × 0.22
  finalPrice: 16531000,         // 13.55M + 2.981M
};

/**
 * Expected result structure validation
 */
export const expectedResultStructure = {
  hasProject: true,
  hasCosts: true,
  hasFinancialSummary: true,
  hasCalculatedAt: true,
  hasVersion: true,
  costCategories: [
    'material',
    'boreshKari',
    'cnc',
    'navarShiar',
    'fittings',
    'painting',
    'plate',
    'woodTools',
  ],
};

/**
 * Minimum expected values for validation
 */
export const minimumExpectedValues = {
  material: {
    minCost: 0,
    minArea: 0,
  },
  cnc: {
    minCostPerOperation: 200000, // At least 200,000 per CNC operation
  },
  fittings: {
    minCostPerHinge: 150000, // At least 150,000 per hinge
  },
  woodTools: {
    minBaseCost: 500000, // Always at least base cost
  },
};

/**
 * Test tolerance for floating point comparisons
 */
export const CALCULATION_TOLERANCE = 100; // Allow 100 Rials difference due to rounding

/**
 * Expected material category structure
 */
export const materialCategoryStructure: Partial<MaterialCategory> = {
  category: 'Material',
  totalCost: expect.any(Number),
  totalArea: expect.any(Number),
  totalQuantity: expect.any(Number),
  items: expect.any(Array),
};

/**
 * Expected CNC category structure
 */
export const cncCategoryStructure: Partial<CNCCategory> = {
  category: 'CNC',
  totalCost: expect.any(Number),
  items: expect.any(Array),
};

/**
 * Expected fittings category structure
 */
export const fittingsCategoryStructure: Partial<FittingsCategory> = {
  category: 'Fittings',
  totalCost: expect.any(Number),
  items: expect.any(Array),
};


"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CALCULATION_TOLERANCE () {
        return CALCULATION_TOLERANCE;
    },
    get cncCategoryStructure () {
        return cncCategoryStructure;
    },
    get exampleFinancialSummary () {
        return exampleFinancialSummary;
    },
    get expectedCNCCost () {
        return expectedCNCCost;
    },
    get expectedDoorFittingsCost () {
        return expectedDoorFittingsCost;
    },
    get expectedDoorMaterialCost () {
        return expectedDoorMaterialCost;
    },
    get expectedDrawerFittingsCost () {
        return expectedDrawerFittingsCost;
    },
    get expectedOverheadPercentages () {
        return expectedOverheadPercentages;
    },
    get expectedResultStructure () {
        return expectedResultStructure;
    },
    get expectedWoodToolsCost () {
        return expectedWoodToolsCost;
    },
    get fittingsCategoryStructure () {
        return fittingsCategoryStructure;
    },
    get materialCategoryStructure () {
        return materialCategoryStructure;
    },
    get minimumExpectedValues () {
        return minimumExpectedValues;
    }
});
const expectedDoorMaterialCost = {
    totalCost: 10560000,
    totalArea: 0.48,
    totalQuantity: 1
};
const expectedCNCCost = {
    totalCost: 500000,
    itemCount: 1
};
const expectedDoorFittingsCost = {
    totalCost: 800000,
    itemCount: 1
};
const expectedDrawerFittingsCost = {
    totalCost: 3450000,
    itemCount: 2
};
const expectedWoodToolsCost = {
    baseCost: 500000,
    cncCost: 20000,
    totalCost: 520000
};
const expectedOverheadPercentages = {
    overhead1: 0.25,
    overhead2: 0.04,
    overhead3: 0.02,
    overhead4: 0.02,
    contingency: 0.025,
    profitMargin: 0.22
};
const exampleFinancialSummary = {
    subtotal: 10000000,
    overheads: {
        overhead1: 2500000,
        overhead2: 400000,
        overhead3: 200000,
        overhead4: 200000,
        contingency: 250000,
        totalOverheads: 3550000
    },
    totalWithOverheads: 13550000,
    profitAmount: 2981000,
    finalPrice: 16531000
};
const expectedResultStructure = {
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
        'woodTools'
    ]
};
const minimumExpectedValues = {
    material: {
        minCost: 0,
        minArea: 0
    },
    cnc: {
        minCostPerOperation: 200000
    },
    fittings: {
        minCostPerHinge: 150000
    },
    woodTools: {
        minBaseCost: 500000
    }
};
const CALCULATION_TOLERANCE = 100; // Allow 100 Rials difference due to rounding
const materialCategoryStructure = {
    category: 'Material',
    totalCost: expect.any(Number),
    totalArea: expect.any(Number),
    totalQuantity: expect.any(Number),
    items: expect.any(Array)
};
const cncCategoryStructure = {
    category: 'CNC',
    totalCost: expect.any(Number),
    items: expect.any(Array)
};
const fittingsCategoryStructure = {
    category: 'Fittings',
    totalCost: expect.any(Number),
    items: expect.any(Array)
};

//# sourceMappingURL=expected-results.fixture.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MaterialsService", {
    enumerable: true,
    get: function() {
        return MaterialsService;
    }
});
const _common = require("@nestjs/common");
const _pricinglookupservice = require("../../common/utils/pricing-lookup.service");
const _excelfunctions = require("../../common/utils/excel-functions");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MaterialsService = class MaterialsService {
    /**
   * Calculate material costs from processed components
   * Replicates VBA Material() macro and Material sheet calculations
   * 
   * Excel flow:
   * 1. Creates Pivot Table from "All" sheet (W:X range)
   * 2. Groups by Material, sums SumArea
   * 3. Copies pivot results to Material sheet (AA4:AB27 → I7:H7)
   * 4. VLOOKUPs material descriptions and units (W:Z range)
   * 5. Calculates costs and sums to A31
   * 
   * @param components - Processed components with material data
   * @returns MaterialCategory with calculated costs
   */ async calculateMaterialCosts(components) {
        console.log(`MaterialsService: Calculating costs for ${components.length} components`);
        // Step 1: Group components by material type (Pivot Table equivalent)
        // Excel: Pivot Table on All sheet W:X, grouped by Material
        const materialGroups = this.groupByMaterial(components);
        console.log(`MaterialsService: Found ${Object.keys(materialGroups).length} material groups:`, Object.keys(materialGroups));
        // Step 2: Calculate cost for each material group
        const items = [];
        let totalCost = 0;
        let totalArea = 0;
        let totalQuantity = 0;
        for (const [materialType, groupData] of Object.entries(materialGroups)){
            console.log(`MaterialsService: Processing material "${materialType}" with area ${groupData.totalArea}m²`);
            // VLOOKUP material info from pricing tables (W:Z range)
            // Try by name first (handles Persian names), then by code
            const materialInfo = await this.pricingLookup.getMaterialByName(materialType) || await this.pricingLookup.getMaterialByCode(materialType);
            if (!materialInfo) {
                // If material not found in pricing table, use default pricing
                console.warn(`Material not found in pricing table: ${materialType}, using default`);
                // Use default MDF pricing as fallback
                const allMaterials = await this.pricingLookup.getAllMaterials();
                const defaultMaterial = allMaterials[0];
                if (!defaultMaterial) {
                    console.error('No materials in pricing table!');
                    continue;
                }
                // Continue with default material
                const cost = (0, _excelfunctions.round)(groupData.totalArea * (defaultMaterial.unitPrice || 125000), 0);
                items.push({
                    cost,
                    description: materialType || defaultMaterial.description,
                    unit: defaultMaterial.unit || 'm²',
                    quantity: groupData.totalArea,
                    code: materialType
                });
                totalCost += cost;
                totalArea += groupData.totalArea;
                totalQuantity += groupData.count;
                continue;
            }
            // Calculate total area for this material (SumArea from pivot)
            const groupArea = groupData.totalArea;
            // Calculate cost = area * unit price
            // Excel: Material sheet, Column A (cost calculations)
            const cost = (0, _excelfunctions.round)(groupArea * (materialInfo.unitPrice || 0), 0);
            items.push({
                cost,
                description: materialInfo.description,
                unit: materialInfo.unit,
                quantity: groupArea,
                code: materialType
            });
            totalCost += cost;
            totalArea += groupArea;
            totalQuantity += groupData.count;
        }
        // Sum totals (Material!A31, C31, E31, G31)
        return {
            category: 'Material',
            totalCost: (0, _excelfunctions.round)(totalCost, 0),
            totalArea: (0, _excelfunctions.round)(totalArea, 2),
            totalQuantity: (0, _excelfunctions.round)(totalQuantity, 0),
            items
        };
    }
    /**
   * Group components by material type and sum areas
   * Replicates Excel Pivot Table: PivotFields("Material").Orientation = xlRowField
   * 
   * @param components - Array of processed components
   * @returns Map of material type to aggregated data
   */ groupByMaterial(components) {
        const groups = {};
        for (const component of components){
            const materialKey = component.materialType;
            if (!groups[materialKey]) {
                groups[materialKey] = {
                    totalArea: 0,
                    count: 0,
                    components: []
                };
            }
            // Sum area (SumArea field in pivot table)
            // Excel: .PivotFields("SumArea").Orientation = xlDataField
            groups[materialKey].totalArea += component.sumArea || component.area;
            groups[materialKey].count += 1;
            groups[materialKey].components.push(component);
        }
        return groups;
    }
    /**
   * Calculate material requirements with waste percentage
   * Applies waste multiplier from Data!E2
   * 
   * @param materialCosts - Base material costs
   * @param wastePercentage - Waste percentage (e.g., 0.15 for 15%)
   * @returns Adjusted material costs with waste included
   */ applyWastePercentage(materialCosts, wastePercentage) {
        const wasteMultiplier = 1 + wastePercentage;
        return {
            ...materialCosts,
            totalCost: (0, _excelfunctions.round)(materialCosts.totalCost * wasteMultiplier, 0),
            totalArea: materialCosts.totalArea ? (0, _excelfunctions.round)(materialCosts.totalArea * wasteMultiplier, 2) : undefined,
            items: materialCosts.items.map((item)=>({
                    ...item,
                    cost: (0, _excelfunctions.round)(item.cost * wasteMultiplier, 0),
                    quantity: (0, _excelfunctions.round)(item.quantity * wasteMultiplier, 2)
                }))
        };
    }
    /**
   * Get material summary statistics
   * Useful for reporting and validation
   */ getMaterialSummary(materialCosts) {
        const items = materialCosts.items;
        const totalMaterials = items.length;
        const averageCostPerItem = totalMaterials > 0 ? materialCosts.totalCost / totalMaterials : 0;
        const mostExpensive = items.reduce((max, item)=>item.cost > max.cost ? item : max, items[0] || {
            cost: 0,
            description: ''
        });
        return {
            totalMaterials,
            averageCostPerItem: (0, _excelfunctions.round)(averageCostPerItem, 0),
            totalArea: materialCosts.totalArea || 0,
            mostExpensiveMaterial: mostExpensive.description
        };
    }
    /**
   * Validate material costs against expected ranges
   * Helps catch calculation errors
   */ validateMaterialCosts(materialCosts) {
        const warnings = [];
        // Check for zero or negative costs
        if (materialCosts.totalCost <= 0) {
            warnings.push('Total material cost is zero or negative');
        }
        // Check for items with zero cost
        materialCosts.items.forEach((item, index)=>{
            if (item.cost <= 0) {
                warnings.push(`Item ${index + 1} (${item.description}) has zero or negative cost`);
            }
            if (item.quantity <= 0) {
                warnings.push(`Item ${index + 1} (${item.description}) has zero or negative quantity`);
            }
        });
        return {
            isValid: warnings.length === 0,
            warnings
        };
    }
    constructor(pricingLookup){
        this.pricingLookup = pricingLookup;
    }
};
MaterialsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _pricinglookupservice.PricingLookupService === "undefined" ? Object : _pricinglookupservice.PricingLookupService
    ])
], MaterialsService);

//# sourceMappingURL=materials.service.js.map
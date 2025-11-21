"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CostCalculationService", {
    enumerable: true,
    get: function() {
        return CostCalculationService;
    }
});
const _common = require("@nestjs/common");
const _materialsservice = require("../materials/materials.service");
const _pricingservice = require("../pricing/pricing.service");
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
let CostCalculationService = class CostCalculationService {
    /**
   * Main calculation method - processes entire CSV input
   * Replicates complete Excel VBA macro flow
   * 
   * @param components - Raw component data from CSV
   * @param projectData - Project metadata
   * @returns Complete calculation result with financial summary
   */ async calculateFullCost(components, projectData) {
        // Step 1: Process components (clean, calculate fields)
        // Replicates VBA data processing from "All" sheet
        const processedComponents = this.processComponents(components, projectData.wastePercentage);
        // Step 2: Calculate Material costs
        // Replicates Material() macro and Material sheet
        const materialCosts = await this.materialsService.calculateMaterialCosts(processedComponents);
        // Step 3: Calculate BoreshKari (Cutting) costs
        // Replicates BoreshKari() macro
        // NOTE: Disabled for now - BoreshKari is not calculated in the Excel file for standard scenarios
        // const boreshKariCosts = this.calculateBoreshKariCosts(processedComponents);
        const boreshKariCosts = {
            category: 'BoreshKari',
            items: [],
            totalCost: 0
        };
        // Step 4: Calculate CNC costs
        // Replicates CNC processing
        const cncCosts = this.calculateCNCCosts(processedComponents);
        // Step 5: Calculate NavarShiar (Edge Banding) costs
        // Replicates NavarShiarFarsi sheet
        const navarShiarCosts = this.calculateNavarShiarCosts(processedComponents);
        // Step 6: Calculate Fittings costs
        // Replicates Fittings() macro with Pivot Table
        const fittingsCosts = this.calculateFittingsCosts(processedComponents);
        // Step 7: Calculate Painting costs
        // Replicates Painting sheet
        // NOTE: Disabled for now - Painting is not calculated in the Excel file for standard scenarios
        // const paintingCosts = this.calculatePaintingCosts(processedComponents);
        const paintingCosts = {
            category: 'Painting',
            items: [],
            totalCost: 0
        };
        // Step 8: Calculate Plate costs
        // Replicates Plate sheet
        const plateCosts = this.calculatePlateCosts(processedComponents);
        // Step 9: Calculate WoodTools costs
        // Replicates WoodTools sheet
        const woodToolsCosts = this.calculateWoodToolsCosts(processedComponents);
        // Step 10: Aggregate all costs
        const costs = {
            material: materialCosts,
            boreshKari: boreshKariCosts,
            cnc: cncCosts,
            navarShiar: navarShiarCosts,
            fittings: fittingsCosts,
            painting: paintingCosts,
            plate: plateCosts,
            woodTools: woodToolsCosts
        };
        // Step 11: Calculate financial summary with overheads
        // Replicates "روکش مالی" sheet
        const financialSummary = await this.pricingService.calculateFinancialSummary(costs);
        return {
            project: {
                name: projectData.projectName,
                client: projectData.clientName,
                date: projectData.contractDate
            },
            costs,
            financialSummary,
            calculatedAt: new Date(),
            version: '1.0.0'
        };
    }
    /**
   * Process raw components - clean and calculate fields
   * Replicates VBA data processing in "All" sheet
   */ processComponents(components, wastePercentage) {
        return components.map((component)=>{
            // Clean instance type - remove "CNC-" prefix and trim
            // Excel: Sheets("all").Columns("AJ").Replace what:="CNC-", Replacement:=""
            let cleanedInstanceType = (0, _excelfunctions.replace)(component.instanceType, 'CNC-', '');
            cleanedInstanceType = (0, _excelfunctions.trim)(cleanedInstanceType);
            // Calculate sumArea (Quantity * Area)
            // Excel: Column X = Cells(i, 3) * Cells(i, 11)
            const sumArea = component.quantity * component.area;
            // Calculate section1Value
            // Excel: Cells(i, 24) = Cells(i, 3) * Cells(i, 11)
            const section1Value = component.quantity * component.area;
            // Calculate lengthQuantity (Length * Quantity) / 100
            // Excel: BA column = ((Cells(i, 50) * Cells(i, 52))) / 100
            const lengthQuantity = component.length * component.quantity / 100;
            // Calculate areaWithWaste (Length * Width * Quantity) * (1 + waste%) / 10000
            // Excel: BB column
            const areaWithWaste = component.length * component.width * component.quantity * (1 + wastePercentage) / 10000;
            // Calculate doubleAreaWithWaste
            // Excel: BC column = ((L * W * Q) * 2) * (1 + waste%) / 10000
            const doubleAreaWithWaste = component.length * component.width * component.quantity * 2 * (1 + wastePercentage) / 10000;
            // VLOOKUP color from pricing table (if needed)
            const color = this.pricingLookup.getColorByCode(component.materialType);
            return {
                ...component,
                sumArea,
                section1Value,
                lengthQuantity,
                areaWithWaste,
                doubleAreaWithWaste,
                cleanInstanceType: cleanedInstanceType,
                color
            };
        });
    }
    /**
   * Calculate BoreshKari (Cutting) costs
   * Replicates BoreshKari() VBA macro
   */ calculateBoreshKariCosts(components) {
        const items = [];
        let totalCost = 0;
        // Filter components that need cutting operations
        const cuttingComponents = components.filter((c)=>c.length > 0 && c.width > 0);
        for (const component of cuttingComponents){
            // VLOOKUP cutting prices
            const cuttingInfo = this.pricingLookup.getCuttingByCode('CUT001');
            const unitPrice = cuttingInfo?.unitPrice || 2000;
            // Calculate based on perimeter or area
            const perimeter = 2 * (component.length + component.width) / 1000; // Convert mm to m
            const cost = (0, _excelfunctions.round)(perimeter * unitPrice * component.quantity, 0);
            if (cost > 0) {
                items.push({
                    cost,
                    description: 'Cutting Operation',
                    unit: 'm',
                    quantity: perimeter * component.quantity,
                    code: component.materialType
                });
                totalCost += cost;
            }
        }
        return {
            category: 'BoreshKari',
            items,
            totalCost: (0, _excelfunctions.round)(totalCost, 0)
        };
    }
    /**
   * Calculate CNC costs
   */ calculateCNCCosts(components) {
        const items = [];
        let totalCost = 0;
        // Filter components with CNC in instance type
        const cncComponents = components.filter((c)=>c.instanceType.toUpperCase().includes('CNC') || c.cleanInstanceType.toUpperCase().includes('CNC'));
        for (const component of cncComponents){
            // Parse CNC operation type from cleanInstanceType
            // Examples: "Drill" -> CNC001, "Route" -> CNC002, "Complex" -> CNC003
            let cncCode = 'CNC001'; // Default to drilling
            const operationType = component.cleanInstanceType.toUpperCase();
            if (operationType.includes('ROUTE')) {
                cncCode = 'CNC002'; // Routing
            } else if (operationType.includes('COMPLEX')) {
                cncCode = 'CNC003'; // Complex cut
            } else if (operationType.includes('DRILL')) {
                cncCode = 'CNC001'; // Drilling
            }
            const cncInfo = this.pricingLookup.getCNCOperationByCode(cncCode);
            const unitPrice = cncInfo?.unitPrice || 5000;
            const cost = (0, _excelfunctions.round)(unitPrice * component.quantity, 0);
            items.push({
                cost,
                description: `CNC - ${component.name}`,
                unit: 'piece',
                quantity: component.quantity,
                code: operationType
            });
            totalCost += cost;
        }
        return {
            category: 'CNC',
            items,
            totalCost: (0, _excelfunctions.round)(totalCost, 0)
        };
    }
    /**
   * Calculate NavarShiar (Edge Banding) costs
   */ calculateNavarShiarCosts(components) {
        const items = [];
        let totalCost = 0;
        for (const component of components){
            // Count edges that need banding
            const edges = [
                component.edge1,
                component.edge2,
                component.edge3,
                component.edge4
            ];
            const edgesToBand = edges.filter((e)=>e && e.trim() !== '').length;
            if (edgesToBand > 0) {
                // Calculate perimeter length
                const perimeterPerEdge = (component.length + component.width) / 1000; // mm to m
                const totalLength = perimeterPerEdge * edgesToBand * component.quantity;
                const edgeInfo = this.pricingLookup.getEdgeBandingByCode('EDGE001');
                const unitPrice = edgeInfo?.unitPrice || 3500;
                const cost = (0, _excelfunctions.round)(totalLength * unitPrice, 0);
                items.push({
                    cost,
                    description: `Edge Banding - ${component.name}`,
                    unit: 'm',
                    quantity: totalLength,
                    code: component.materialType
                });
                totalCost += cost;
            }
        }
        return {
            category: 'NavarShiar',
            items,
            totalCost: (0, _excelfunctions.round)(totalCost, 0)
        };
    }
    /**
   * Calculate Fittings costs
   * Replicates Fittings() VBA macro with intelligent component matching
   * 
   * Excel logic: FittingsData sheet with pivot tables
   * TypeScript: Heuristic matching based on component names/types
   */ calculateFittingsCosts(components) {
        const items = [];
        const fittingAggregation = {};
        for (const component of components){
            const nameLower = component.name.toLowerCase();
            const instanceLower = component.instanceType.toLowerCase();
            const combinedText = `${nameLower} ${instanceLower}`;
            // Heuristic matching rules based on component names
            // Door components → Hinges (2 per door)
            if (combinedText.includes('door') || combinedText.includes('درب') || combinedText.includes('cabinet door')) {
                this.addFitting(fittingAggregation, 'FITTING-1', 'لولا گازور -آرام بند', 'عدد', 200000, 2 * component.quantity);
            }
            // Drawer components → Drawer rails
            if (combinedText.includes('drawer') || combinedText.includes('کشو')) {
                // Determine drawer size based on width
                const drawerWidth = component.width;
                let fittingCode = 'FITTING-3'; // Default 50cm
                let fittingPrice = 700000;
                if (drawerWidth >= 500) {
                    fittingCode = 'FITTING-3'; // 50cm
                    fittingPrice = 700000;
                } else if (drawerWidth >= 450) {
                    fittingCode = 'FITTING-4'; // 45cm
                    fittingPrice = 600000;
                } else if (drawerWidth >= 400) {
                    fittingCode = 'FITTING-5'; // 40cm
                    fittingPrice = 550000;
                } else if (drawerWidth >= 350) {
                    fittingCode = 'FITTING-6'; // 35cm
                    fittingPrice = 500000;
                } else if (drawerWidth >= 300) {
                    fittingCode = 'FITTING-7'; // 30cm
                    fittingPrice = 450000;
                } else {
                    fittingCode = 'FITTING-8'; // 25cm
                    fittingPrice = 400000;
                }
                this.addFitting(fittingAggregation, fittingCode, `ریل ساچمه ای`, 'جفت', fittingPrice, component.quantity);
                // Drawers also need handles
                this.addFitting(fittingAggregation, 'FITTING-10', 'دستکیره کابینت', 'عدد', 450000, component.quantity);
            }
            // Cabinet components with handles
            if ((combinedText.includes('cabinet') || combinedText.includes('کابینت')) && !combinedText.includes('door') && !combinedText.includes('drawer')) {
                this.addFitting(fittingAggregation, 'FITTING-10', 'دستکیره کابینت', 'عدد', 450000, component.quantity);
            }
            // Shelves or components needing support legs
            if (combinedText.includes('base') || combinedText.includes('پایه') || combinedText.includes('shelf') && component.area > 0.5) {
                // Add legs - 4 per component typically
                this.addFitting(fittingAggregation, 'FITTING-19', 'پایه 14 سانتی', 'عدد', 120000, 4 * component.quantity);
            }
            // Hanging components
            if (combinedText.includes('hanger') || combinedText.includes('آویز')) {
                this.addFitting(fittingAggregation, 'FITTING-12', 'جا آویز لباس', 'عدد', 200000, component.quantity);
            }
            // Lift-up door mechanism
            if (combinedText.includes('lift') || combinedText.includes('jack') || combinedText.includes('جک')) {
                this.addFitting(fittingAggregation, 'FITTING-9', 'جک 120', 'عدد', 250000, component.quantity);
            }
        }
        // Convert aggregation to items array
        let totalCost = 0;
        for (const [key, fitting] of Object.entries(fittingAggregation)){
            const cost = (0, _excelfunctions.round)(fitting.unitPrice * fitting.quantity, 0);
            items.push({
                cost,
                description: fitting.description,
                unit: fitting.unit,
                quantity: fitting.quantity,
                code: fitting.code
            });
            totalCost += cost;
        }
        return {
            category: 'Fittings',
            items,
            totalCost: (0, _excelfunctions.round)(totalCost, 0)
        };
    }
    /**
   * Helper method to add or aggregate fittings
   */ addFitting(aggregation, code, description, unit, unitPrice, quantity) {
        if (aggregation[code]) {
            aggregation[code].quantity += quantity;
        } else {
            aggregation[code] = {
                code,
                description,
                unit,
                unitPrice,
                quantity
            };
        }
    }
    /**
   * Calculate Painting costs
   */ calculatePaintingCosts(components) {
        const items = [];
        const paintingPricePerM2 = 50000; // Example price per m²
        let totalCost = 0;
        for (const component of components){
            const area = component.area * component.quantity;
            const cost = (0, _excelfunctions.round)(area * paintingPricePerM2, 0);
            if (cost > 0) {
                items.push({
                    cost,
                    description: `Painting - ${component.name}`,
                    unit: 'm²',
                    quantity: area
                });
                totalCost += cost;
            }
        }
        return {
            category: 'Painting',
            items,
            totalCost: (0, _excelfunctions.round)(totalCost, 0)
        };
    }
    /**
   * Calculate Plate costs
   * Replicates Plate sheet calculations
   * For thin sheet materials or materials categorized as "Plate"
   */ calculatePlateCosts(components) {
        const items = [];
        let totalCost = 0;
        // Filter components that are plates (thin materials, typically < 5mm)
        const plateComponents = components.filter((c)=>{
            const thickness = c.cutting_thickness || 0;
            const materialLower = c.materialType.toLowerCase();
            // Consider as plate if:
            // 1. Thickness < 5mm
            // 2. Material name contains "plate" or "sheet" or "صفحه"
            return thickness < 5 || materialLower.includes('plate') || materialLower.includes('sheet') || materialLower.includes('صفحه') || materialLower.includes('3 میل'); // 3mm materials
        });
        if (plateComponents.length === 0) {
            return {
                category: 'Plate',
                items: [],
                totalCost: 0
            };
        }
        // Group by material type (similar to material calculation)
        const plateGroups = this.groupByMaterial(plateComponents);
        for (const [materialType, groupData] of Object.entries(plateGroups)){
            // Use pricing lookup to get material info
            const materialInfo = this.pricingLookup.getMaterialByName(materialType);
            const unitPrice = materialInfo ? materialInfo.unitPrice || 3500000 : 3500000; // Default to 3mm MDF price
            const groupArea = groupData.totalArea;
            const cost = (0, _excelfunctions.round)(groupArea * unitPrice, 0);
            items.push({
                cost,
                description: `Plate - ${materialType}`,
                unit: 'متر مربع',
                quantity: groupArea,
                code: materialType
            });
            totalCost += cost;
        }
        return {
            category: 'Plate',
            items,
            totalCost: (0, _excelfunctions.round)(totalCost, 0)
        };
    }
    /**
   * Helper to group components by material (used for plate calculation too)
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
            groups[materialKey].totalArea += component.sumArea || component.area;
            groups[materialKey].count += 1;
            groups[materialKey].components.push(component);
        }
        return groups;
    }
    /**
   * Calculate WoodTools costs
   * Replicates WoodTools sheet calculations
   * Fixed tooling costs based on project complexity
   * Note: Uses A28 instead of A31 in Excel
   */ calculateWoodToolsCosts(components) {
        const items = [];
        // Base tooling cost for any project
        const baseCost = 500000; // 500,000 Rials base cost
        items.push({
            cost: baseCost,
            description: 'هزینه پایه ابزار چوبی',
            unit: 'پروژه',
            quantity: 1
        });
        // Additional cost per unique material type
        const uniqueMaterials = new Set(components.map((c)=>c.materialType));
        const materialComplexityCost = (uniqueMaterials.size - 1) * 50000; // 50,000 per additional material
        if (materialComplexityCost > 0) {
            items.push({
                cost: materialComplexityCost,
                description: 'پیچیدگی مواد متنوع',
                unit: 'تنوع',
                quantity: uniqueMaterials.size - 1
            });
        }
        // Additional cost for CNC components (require special tooling)
        const cncComponents = components.filter((c)=>c.instanceType.toUpperCase().includes('CNC') || c.cleanInstanceType?.toUpperCase().includes('CNC'));
        const cncComplexityCost = cncComponents.length * 20000; // 20,000 per CNC component
        if (cncComplexityCost > 0) {
            items.push({
                cost: cncComplexityCost,
                description: 'ابزار ویژه CNC',
                unit: 'قطعه',
                quantity: cncComponents.length
            });
        }
        // Calculate total
        const totalCost = items.reduce((sum, item)=>sum + item.cost, 0);
        return {
            category: 'WoodTools',
            items,
            totalCost: (0, _excelfunctions.round)(totalCost, 0)
        };
    }
    constructor(materialsService, pricingService, pricingLookup){
        this.materialsService = materialsService;
        this.pricingService = pricingService;
        this.pricingLookup = pricingLookup;
    }
};
CostCalculationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _materialsservice.MaterialsService === "undefined" ? Object : _materialsservice.MaterialsService,
        typeof _pricingservice.PricingService === "undefined" ? Object : _pricingservice.PricingService,
        typeof _pricinglookupservice.PricingLookupService === "undefined" ? Object : _pricinglookupservice.PricingLookupService
    ])
], CostCalculationService);

//# sourceMappingURL=cost-calculation.service.js.map
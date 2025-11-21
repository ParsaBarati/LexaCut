"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DataProcessingService", {
    enumerable: true,
    get: function() {
        return DataProcessingService;
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
let DataProcessingService = class DataProcessingService {
    /**
   * Process raw CSV data - Replicates CopyP1() VBA macro
   * 
   * Excel Flow:
   * 1. Sheets("all").Range(Range("a2"), Cells(Lastcount, "c")).Copy Sheets("p1").Range("b11")
   * 2. Clean "CNC-" prefix: Sheets("all").Columns("AJ").Replace what:="CNC-", Replacement:=""
   * 3. Trim values: Application.WorksheetFunction.Trim(iCells.Value)
   * 4. Calculate Section 1: Cells(i, 24) = Cells(i, 3) * Cells(i, 11)
   * 5. Calculate BA: Cells(i, 53) = ((Cells(i, 50) * Cells(i, 52))) / 100
   * 6. Calculate BB: Cells(i, 54) = (Length * Width * Qty) * (1 + waste%) / 10000
   * 7. Calculate BC: Cells(i, 55) = ((Length * Width * Qty) * 2) * (1 + waste%) / 10000
   * 8. VLOOKUP colors: DataDsc.Value = VLOOKUP(DataCode, MyRange, 2, 0)
   */ processAllSheetData(components, wastePercentage) {
        return components.map((component)=>{
            // Excel: Sheets("all").Columns("AJ").Replace what:="CNC-", Replacement:=""
            // Remove "CNC-" prefix from instance type
            let cleanedInstanceType = (0, _excelfunctions.replace)(component.instanceType || '', 'CNC-', '');
            // Excel: Application.WorksheetFunction.Trim(iCells.Value)
            // Trim whitespace
            cleanedInstanceType = (0, _excelfunctions.trim)(cleanedInstanceType);
            // Excel: Cells(i, 24) = Cells(i, 3) * Cells(i, 11)
            // Calculate sumArea (Quantity * Area)
            // Column X (24) = Column C (3) * Column L (11)
            const sumArea = component.quantity * component.area;
            // Excel: Cells(i, 24) = Cells(i, 3) * Cells(i, 11)
            // Section1Value is same as sumArea
            const section1Value = sumArea;
            // Excel: Cells(i, 53) = ((Cells(i, 50) * Cells(i, 52))) / 100
            // Calculate lengthQuantity: (Length * Quantity) / 100
            // Column BA (53) = (Column AX (50) * Column AZ (52)) / 100
            const lengthQuantity = component.length * component.quantity / 100;
            // Excel: Cells(i, 54) = (((Cells(i, 50) * Cells(i, 51) * Cells(i, 52))) * (((Sheets("Data").Range("E2"))) + 1) / 100) / 100
            // Calculate areaWithWaste: (L * W * Q) * (1 + waste%) / 10000
            // Column BB (54) = (AX * AY * AZ) * (1 + Data!E2) / 10000
            const areaWithWaste = component.length * component.width * component.quantity * (1 + wastePercentage) / 10000;
            // Excel: Cells(i, 55) = ((((Cells(i, 50) * Cells(i, 51) * Cells(i, 52)) * 2) * (((Sheets("Data").Range("E2"))) + 1)) / 100) / 100
            // Calculate doubleAreaWithWaste: ((L * W * Q) * 2) * (1 + waste%) / 10000
            // Column BC (55) = ((AX * AY * AZ) * 2) * (1 + Data!E2) / 10000
            const doubleAreaWithWaste = component.length * component.width * component.quantity * 2 * (1 + wastePercentage) / 10000;
            // Excel: Set MyRange = Sheets("Data").Range("L:M")
            // Excel: DataDsc.Value = Application.WorksheetFunction.VLookup(DataCode, MyRange, 2, 0)
            // VLOOKUP color from Data sheet (L:M range)
            // Column AT = VLOOKUP(Column AU, Data!L:M, 2, 0)
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
   * Copy data to P1 sheet equivalent
   * Replicates the copy operations in CopyP1() macro
   * 
   * Excel: Sheets("all").Range(Range("a2"), Cells(Lastcount, "c")).Copy Sheets("p1").Range("b11")
   */ copyToP1Sheet(components) {
        // In our implementation, P1 is just the processed component array
        // Excel copies columns A-C, I-J, H to different positions
        // We maintain all data in the ProcessedComponent structure
        return components;
    }
    /**
   * Validate processed data
   * Ensures all required fields are present and valid
   */ validateProcessedData(components) {
        const errors = [];
        components.forEach((component, index)=>{
            // Check required fields
            if (!component.name || component.name.trim() === '') {
                errors.push(`Row ${index + 1}: Missing component name`);
            }
            if (component.quantity <= 0) {
                errors.push(`Row ${index + 1}: Invalid quantity (${component.quantity})`);
            }
            if (component.length <= 0 || component.width <= 0) {
                errors.push(`Row ${index + 1}: Invalid dimensions (L:${component.length}, W:${component.width})`);
            }
            if (component.area <= 0) {
                errors.push(`Row ${index + 1}: Invalid area (${component.area})`);
            }
            // Check calculated fields
            if (component.sumArea !== component.quantity * component.area) {
                errors.push(`Row ${index + 1}: sumArea calculation mismatch`);
            }
        });
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    /**
   * Get processing statistics
   * For debugging and validation
   */ getProcessingStats(components) {
        return {
            totalComponents: components.length,
            totalQuantity: components.reduce((sum, c)=>sum + c.quantity, 0),
            totalArea: components.reduce((sum, c)=>sum + c.area, 0),
            totalSumArea: components.reduce((sum, c)=>sum + c.sumArea, 0),
            uniqueMaterials: new Set(components.map((c)=>c.materialType)).size,
            cncComponents: components.filter((c)=>c.instanceType.toUpperCase().includes('CNC') || c.cleanInstanceType.toUpperCase().includes('CNC')).length
        };
    }
    constructor(pricingLookup){
        this.pricingLookup = pricingLookup;
    }
};
DataProcessingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _pricinglookupservice.PricingLookupService === "undefined" ? Object : _pricinglookupservice.PricingLookupService
    ])
], DataProcessingService);

//# sourceMappingURL=data-processing.service.js.map
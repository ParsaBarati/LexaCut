"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CostCalculationController", {
    enumerable: true,
    get: function() {
        return CostCalculationController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _swagger = require("@nestjs/swagger");
const _stream = require("stream");
const _costcalculationservice = require("./cost-calculation.service");
const _calculationdto = require("../../common/dto/calculation.dto");
const _csvparserutil = require("../../common/utils/csv-parser.util");
const _lexacutcolumnmapper = require("../../common/utils/lexacut-column-mapper");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CostCalculationController = class CostCalculationController {
    /**
   * Calculate full cost from JSON payload
   * POST /api/v1/calculate/full
   */ async calculateFullCost(dto) {
        try {
            // Validate components
            const validation = (0, _csvparserutil.validateComponents)(dto.components);
            if (!validation.isValid) {
                throw new _common.HttpException({
                    message: 'Invalid component data',
                    errors: validation.errors,
                    warnings: validation.warnings
                }, _common.HttpStatus.BAD_REQUEST);
            }
            // Calculate
            const result = await this.costCalculationService.calculateFullCost(dto.components, dto.projectData);
            return result;
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            throw new _common.HttpException({
                message: 'Calculation failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * Validate CSV file structure without running full calculation
   * POST /api/v1/calculate/validate
   */ async validateCSV(file) {
        if (!file) {
            throw new _common.HttpException('No file uploaded', _common.HttpStatus.BAD_REQUEST);
        }
        try {
            // Parse CSV to get headers and basic structure
            const stream = _stream.Readable.from(file.buffer);
            const csv = require('csv-parser');
            const rows = [];
            let headers = [];
            await new Promise((resolve, reject)=>{
                stream.pipe(csv()).on('headers', (hdrs)=>{
                    headers = hdrs;
                }).on('data', (row)=>{
                    rows.push(row);
                    // Only collect first 100 rows for validation
                    if (rows.length >= 100) {
                        resolve(rows);
                    }
                }).on('end', ()=>resolve(rows)).on('error', reject);
            });
            // Validate headers against LexaCut format
            const headerValidation = (0, _lexacutcolumnmapper.validateHeaders)(headers);
            // Determine format
            const isLexaCutFormat = headers.some((h)=>h.toLowerCase() === 'cutting length');
            const format = isLexaCutFormat ? 'lexacut' : headers.some((h)=>h.toLowerCase().includes('length - raw')) ? 'legacy' : 'unknown';
            // Try to parse components for additional validation
            let validComponents = 0;
            const errors = [];
            const warnings = [];
            try {
                const stream2 = _stream.Readable.from(file.buffer);
                const components = await (0, _csvparserutil.parseCSV)(stream2);
                validComponents = components.length;
                if (validComponents === 0) {
                    errors.push('No valid components found in CSV');
                } else if (validComponents < rows.length * 0.5) {
                    warnings.push(`Only ${validComponents} out of ${rows.length} rows could be parsed as valid components`);
                }
            } catch (parseError) {
                errors.push(`Parsing error: ${parseError.message}`);
            }
            // Add warnings for missing optional columns
            if (!headerValidation.isValid && headerValidation.missingColumns.length > 0) {
                warnings.push(`Missing recommended columns: ${headerValidation.missingColumns.join(', ')}`);
            }
            return {
                isValid: headerValidation.isValid && validComponents > 0,
                format,
                headers,
                missingColumns: headerValidation.missingColumns,
                extraColumns: headerValidation.extraColumns,
                foundColumns: headerValidation.foundColumns,
                rowCount: rows.length,
                validComponents,
                errors: errors.length > 0 ? errors : undefined,
                warnings: warnings.length > 0 ? warnings : undefined
            };
        } catch (error) {
            throw new _common.HttpException({
                message: 'Validation failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, _common.HttpStatus.BAD_REQUEST);
        }
    }
    /**
   * Calculate cost directly from LexaCut plugin (no CSV)
   * POST /api/v1/calculate/direct
   */ async calculateDirect(dto) {
        try {
            // Transform DirectPartDto to ComponentData format
            const components = dto.parts.map((part)=>({
                    name: part.name,
                    componentId: part.number,
                    quantity: part.count,
                    edge1: part.edge_ymin || '',
                    edge2: part.edge_ymax || '',
                    edge3: part.edge_xmin || '',
                    edge4: part.edge_xmax || '',
                    materialType: part.material_name,
                    instanceType: part.entity_names,
                    length: part.cutting_length,
                    width: part.cutting_width,
                    area: part.final_area
                }));
            // Validate components
            const validation = (0, _csvparserutil.validateComponents)(components);
            if (!validation.isValid) {
                throw new _common.HttpException({
                    message: 'Component validation failed',
                    errors: validation.errors
                }, _common.HttpStatus.BAD_REQUEST);
            }
            // Calculate using the service
            const result = await this.costCalculationService.calculateFullCost(components, dto.projectData);
            return result;
        } catch (error) {
            console.error('Direct calculation error:', error);
            throw new _common.HttpException({
                message: 'Calculation failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * Calculate cost from CSV file upload
   * POST /api/v1/calculate/csv
   */ async calculateFromCSV(file, projectDataJson) {
        if (!file) {
            throw new _common.HttpException('No file uploaded', _common.HttpStatus.BAD_REQUEST);
        }
        try {
            // Parse project data from JSON string
            const projectData = JSON.parse(projectDataJson);
            // Parse CSV
            const stream = _stream.Readable.from(file.buffer);
            let components;
            try {
                components = await (0, _csvparserutil.parseCSV)(stream);
            } catch (error) {
                // If CSV parsing fails, show raw file content for debugging
                const fileContent = file.buffer.toString('utf-8');
                const firstLines = fileContent.split('\n').slice(0, 5).join('\n');
                throw new _common.HttpException({
                    message: 'CSV parsing failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    filePreview: firstLines,
                    fileSize: file.size
                }, _common.HttpStatus.BAD_REQUEST);
            }
            // Debug logging
            console.log(`Parsed ${components.length} components from CSV`);
            if (components.length > 0) {
                console.log('First component:', JSON.stringify(components[0], null, 2));
            } else {
                // If no components, show raw CSV content for debugging
                const fileContent = file.buffer.toString('utf-8');
                const firstLines = fileContent.split('\n').slice(0, 10).join('\n');
                console.log('CSV file content (first 10 lines):', firstLines);
            }
            // Validate
            const validation = (0, _csvparserutil.validateComponents)(components);
            if (!validation.isValid && components.length === 0) {
                // If no components at all, show more details
                const fileContent = file.buffer.toString('utf-8');
                const firstLines = fileContent.split('\n').slice(0, 10).join('\n');
                throw new _common.HttpException({
                    message: 'No valid components found in CSV',
                    errors: [
                        'CSV file appears to be empty or contains no valid data rows',
                        ...validation.errors.slice(0, 5)
                    ],
                    warnings: validation.warnings.slice(0, 5),
                    csvPreview: firstLines,
                    hint: 'Please check that your CSV has the correct column headers: Length - raw, Width - raw, Quantity, Material name, etc.'
                }, _common.HttpStatus.BAD_REQUEST);
            }
            if (!validation.isValid) {
                throw new _common.HttpException({
                    message: 'Invalid CSV data',
                    errors: validation.errors,
                    warnings: validation.warnings
                }, _common.HttpStatus.BAD_REQUEST);
            }
            if (components.length === 0) {
                throw new _common.HttpException({
                    message: 'No valid components found in CSV',
                    errors: [
                        'CSV file appears to be empty or contains no valid data rows'
                    ]
                }, _common.HttpStatus.BAD_REQUEST);
            }
            // Calculate
            const result = await this.costCalculationService.calculateFullCost(components, projectData);
            // Debug logging
            console.log(`Calculation complete. Material cost: ${result.costs.material.totalCost}`);
            return result;
        } catch (error) {
            if (error instanceof _common.HttpException) {
                throw error;
            }
            if (error instanceof SyntaxError) {
                throw new _common.HttpException('Invalid project data JSON', _common.HttpStatus.BAD_REQUEST);
            }
            throw new _common.HttpException({
                message: 'CSV processing failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * Get current pricing configuration
   * GET /api/v1/calculate/config/pricing
   */ async getPricingConfig() {
        // This would come from PricingService
        return {
            overhead1: 0.25,
            overhead2: 0.04,
            overhead3: 0.02,
            overhead4: 0.02,
            contingency: 0.025,
            profitMargin: 0.22
        };
    }
    /**
   * Debug endpoint - Parse file and show detailed information
   * POST /api/v1/calculate/debug
   */ async debugParse(file) {
        if (!file) {
            throw new _common.HttpException('No file uploaded', _common.HttpStatus.BAD_REQUEST);
        }
        try {
            const stream = _stream.Readable.from(file.buffer);
            const components = await (0, _csvparserutil.parseCSV)(stream);
            // Calculate costs to show full processing
            const projectData = {
                name: 'Debug Test',
                client: 'Debug',
                date: new Date().toISOString().split('T')[0]
            };
            const result = await this.costCalculationService.calculateFullCost(components, projectData);
            return {
                fileInfo: {
                    originalName: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                    isExcel: file.buffer[0] === 0x50 && file.buffer[1] === 0x4B
                },
                parsed: {
                    componentCount: components.length,
                    components: components.map((comp)=>({
                            name: comp.name,
                            componentId: comp.componentId,
                            quantity: comp.quantity,
                            length: comp.length,
                            width: comp.width,
                            area: comp.area,
                            materialType: comp.materialType,
                            instanceType: comp.instanceType,
                            edges: {
                                edge1: comp.edge1,
                                edge2: comp.edge2,
                                edge3: comp.edge3,
                                edge4: comp.edge4
                            }
                        }))
                },
                calculations: {
                    material: {
                        totalCost: result.costs.material.totalCost,
                        totalArea: result.costs.material.totalArea,
                        totalQuantity: result.costs.material.totalQuantity,
                        items: result.costs.material.items
                    },
                    subtotal: result.financialSummary.subtotal,
                    finalPrice: result.financialSummary.finalPrice
                },
                verification: {
                    expectedMaterialCost: components.length > 0 && components[0].materialType === 'ام دی اف' ? (components[0].area * components[0].quantity * 125000).toLocaleString() + ' Rials' : 'N/A',
                    note: 'For 333.csv.xlsx: Expected material cost = 0.36 m² × 125,000 = 45,000 Rials'
                }
            };
        } catch (error) {
            throw new _common.HttpException({
                message: 'Debug parsing failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
   * Health check endpoint
   * GET /api/v1/calculate/health
   */ async health() {
        return {
            status: 'ok',
            version: '1.0.0'
        };
    }
    constructor(costCalculationService){
        this.costCalculationService = costCalculationService;
    }
};
_ts_decorate([
    (0, _common.Post)('full'),
    (0, _swagger.ApiOperation)({
        summary: 'Calculate full project cost from JSON data'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Calculation result with financial summary'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input data'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _calculationdto.CalculateFullCostDto === "undefined" ? Object : _calculationdto.CalculateFullCostDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CostCalculationController.prototype, "calculateFullCost", null);
_ts_decorate([
    (0, _common.Post)('validate'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    (0, _swagger.ApiOperation)({
        summary: 'Validate CSV structure without calculation'
    }),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Validation result with detailed feedback'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid file or structure'
    }),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CostCalculationController.prototype, "validateCSV", null);
_ts_decorate([
    (0, _common.Post)('direct'),
    (0, _swagger.ApiOperation)({
        summary: 'Calculate cost from direct API call (LexaCut plugin)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Calculation result with financial summary (JSON)'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid request data'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _calculationdto.DirectCalculationDto === "undefined" ? Object : _calculationdto.DirectCalculationDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CostCalculationController.prototype, "calculateDirect", null);
_ts_decorate([
    (0, _common.Post)('csv'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    (0, _swagger.ApiOperation)({
        summary: 'Calculate cost from CSV or Excel file upload'
    }),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Calculation result with financial summary (JSON)'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid CSV/Excel file or data'
    }),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_param(1, (0, _common.Body)('projectData')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CostCalculationController.prototype, "calculateFromCSV", null);
_ts_decorate([
    (0, _common.Get)('config/pricing'),
    (0, _swagger.ApiOperation)({
        summary: 'Get current pricing configuration'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Pricing configuration'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CostCalculationController.prototype, "getPricingConfig", null);
_ts_decorate([
    (0, _common.Post)('debug'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    (0, _swagger.ApiOperation)({
        summary: 'Debug: Parse file and show detailed parsing info'
    }),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Detailed parsing information'
    }),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], CostCalculationController.prototype, "debugParse", null);
_ts_decorate([
    (0, _common.Get)('health'),
    (0, _swagger.ApiOperation)({
        summary: 'Health check'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Service is healthy'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], CostCalculationController.prototype, "health", null);
CostCalculationController = _ts_decorate([
    (0, _swagger.ApiTags)('Cost Calculation'),
    (0, _common.Controller)('api/v1/calculate'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _costcalculationservice.CostCalculationService === "undefined" ? Object : _costcalculationservice.CostCalculationService
    ])
], CostCalculationController);

//# sourceMappingURL=cost-calculation.controller.js.map
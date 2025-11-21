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
    get CalculateFullCostDto () {
        return CalculateFullCostDto;
    },
    get ComponentDataDto () {
        return ComponentDataDto;
    },
    get DirectCalculationDto () {
        return DirectCalculationDto;
    },
    get DirectPartDto () {
        return DirectPartDto;
    },
    get PricingConfigDto () {
        return PricingConfigDto;
    },
    get ProjectDataDto () {
        return ProjectDataDto;
    },
    get UploadCsvDto () {
        return UploadCsvDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ProjectDataDto = class ProjectDataDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Project name',
        example: 'Kitchen Cabinet Project'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProjectDataDto.prototype, "projectName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Client name',
        example: 'John Doe'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProjectDataDto.prototype, "clientName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Contract date',
        example: '2024-01-15'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProjectDataDto.prototype, "contractDate", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Custom fields',
        example: {
            field1: 'value1'
        }
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], ProjectDataDto.prototype, "customFields", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Waste percentage (e.g., 0.15 for 15%)',
        example: 0.15
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], ProjectDataDto.prototype, "wastePercentage", void 0);
let ComponentDataDto = class ComponentDataDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Component name',
        example: 'Cabinet Door'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ComponentDataDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Component ID',
        example: 'CD-001'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ComponentDataDto.prototype, "componentId", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Quantity',
        example: 4
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], ComponentDataDto.prototype, "quantity", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Edge property 1',
        example: 'PVC'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ComponentDataDto.prototype, "edge1", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Edge property 2',
        example: 'PVC'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ComponentDataDto.prototype, "edge2", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Edge property 3'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ComponentDataDto.prototype, "edge3", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Edge property 4'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ComponentDataDto.prototype, "edge4", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Material type',
        example: 'MDF 18mm'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ComponentDataDto.prototype, "materialType", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Instance type',
        example: 'Cabinet-Standard'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ComponentDataDto.prototype, "instanceType", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Length in mm',
        example: 600
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], ComponentDataDto.prototype, "length", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Width in mm',
        example: 400
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], ComponentDataDto.prototype, "width", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Area in m²',
        example: 0.24
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], ComponentDataDto.prototype, "area", void 0);
let CalculateFullCostDto = class CalculateFullCostDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Project metadata',
        type: ProjectDataDto
    }),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>ProjectDataDto),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof ProjectDataDto === "undefined" ? Object : ProjectDataDto)
], CalculateFullCostDto.prototype, "projectData", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Array of components',
        type: [
            ComponentDataDto
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ComponentDataDto),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Array)
], CalculateFullCostDto.prototype, "components", void 0);
let PricingConfigDto = class PricingConfigDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'General overhead (0.25 = 25%)',
        example: 0.25
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], PricingConfigDto.prototype, "overhead1", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Administrative overhead (0.04 = 4%)',
        example: 0.04
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], PricingConfigDto.prototype, "overhead2", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Additional overhead 1 (0.02 = 2%)',
        example: 0.02
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], PricingConfigDto.prototype, "overhead3", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Additional overhead 2 (0.02 = 2%)',
        example: 0.02
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], PricingConfigDto.prototype, "overhead4", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Contingency (0.025 = 2.5%)',
        example: 0.025
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], PricingConfigDto.prototype, "contingency", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Profit margin (0.22 = 22%)',
        example: 0.22
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], PricingConfigDto.prototype, "profitMargin", void 0);
let UploadCsvDto = class UploadCsvDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Project metadata',
        type: ProjectDataDto
    }),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>ProjectDataDto),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof ProjectDataDto === "undefined" ? Object : ProjectDataDto)
], UploadCsvDto.prototype, "projectData", void 0);
let DirectPartDto = class DirectPartDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Part number',
        example: '1.1'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DirectPartDto.prototype, "number", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Part name',
        example: 'Cabinet Door'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], DirectPartDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Quantity/count',
        example: 2
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], DirectPartDto.prototype, "count", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Cutting length in mm',
        example: 600
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], DirectPartDto.prototype, "cutting_length", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Cutting width in mm',
        example: 400
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], DirectPartDto.prototype, "cutting_width", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Cutting thickness in mm',
        example: 18
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], DirectPartDto.prototype, "cutting_thickness", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Material name',
        example: 'MDF 18mm'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], DirectPartDto.prototype, "material_name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Entity/instance names',
        example: 'Cabinet-Standard, Door-1'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DirectPartDto.prototype, "entity_names", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Edge ymin'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DirectPartDto.prototype, "edge_ymin", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Edge ymax'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DirectPartDto.prototype, "edge_ymax", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Edge xmin'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DirectPartDto.prototype, "edge_xmin", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Edge xmax'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], DirectPartDto.prototype, "edge_xmax", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Final area in m²',
        example: 0.24
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], DirectPartDto.prototype, "final_area", void 0);
let DirectCalculationDto = class DirectCalculationDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Project metadata',
        type: ProjectDataDto
    }),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>ProjectDataDto),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof ProjectDataDto === "undefined" ? Object : ProjectDataDto)
], DirectCalculationDto.prototype, "projectData", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Array of parts from LexaCut',
        type: [
            DirectPartDto
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>DirectPartDto),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Array)
], DirectCalculationDto.prototype, "parts", void 0);

//# sourceMappingURL=calculation.dto.js.map
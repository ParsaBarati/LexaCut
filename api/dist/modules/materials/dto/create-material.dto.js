"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateMaterialDto", {
    enumerable: true,
    get: function() {
        return CreateMaterialDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateMaterialDto = class CreateMaterialDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Unique material code',
        example: 'MAT001'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMaterialDto.prototype, "code", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Material description',
        example: 'MDF 18mm'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMaterialDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Unit of measurement',
        example: 'm²'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMaterialDto.prototype, "unit", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Price per unit',
        example: 125000
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], CreateMaterialDto.prototype, "unitPrice", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Material category',
        example: 'Sheet'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMaterialDto.prototype, "category", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Array of Persian names for matching',
        example: [
            'ام دی اف',
            'MDF'
        ],
        type: [
            String
        ]
    }),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], CreateMaterialDto.prototype, "persianNames", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is material active',
        example: true,
        default: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateMaterialDto.prototype, "isActive", void 0);

//# sourceMappingURL=create-material.dto.js.map
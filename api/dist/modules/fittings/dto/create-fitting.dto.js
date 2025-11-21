"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateFittingDto", {
    enumerable: true,
    get: function() {
        return CreateFittingDto;
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
let CreateFittingDto = class CreateFittingDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Unique fitting code',
        example: 'FIT001'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateFittingDto.prototype, "code", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Fitting name',
        example: 'Cabinet Hinge - Soft Close'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateFittingDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Unit of measurement',
        example: 'piece'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateFittingDto.prototype, "unit", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Price per unit',
        example: 15000
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], CreateFittingDto.prototype, "unitPrice", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Quantity per fitting',
        example: 2,
        default: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], CreateFittingDto.prototype, "qtyPerFitting", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is fitting active',
        example: true,
        default: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateFittingDto.prototype, "isActive", void 0);

//# sourceMappingURL=create-fitting.dto.js.map
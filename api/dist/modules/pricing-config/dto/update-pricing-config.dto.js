"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdatePricingConfigDto", {
    enumerable: true,
    get: function() {
        return UpdatePricingConfigDto;
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
let UpdatePricingConfigDto = class UpdatePricingConfigDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Overhead 1 percentage',
        example: 0.25,
        minimum: 0,
        maximum: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    (0, _classvalidator.Max)(1),
    _ts_metadata("design:type", Number)
], UpdatePricingConfigDto.prototype, "overhead1", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Overhead 2 percentage',
        example: 0.04,
        minimum: 0,
        maximum: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    (0, _classvalidator.Max)(1),
    _ts_metadata("design:type", Number)
], UpdatePricingConfigDto.prototype, "overhead2", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Overhead 3 percentage',
        example: 0.02,
        minimum: 0,
        maximum: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    (0, _classvalidator.Max)(1),
    _ts_metadata("design:type", Number)
], UpdatePricingConfigDto.prototype, "overhead3", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Overhead 4 percentage',
        example: 0.02,
        minimum: 0,
        maximum: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    (0, _classvalidator.Max)(1),
    _ts_metadata("design:type", Number)
], UpdatePricingConfigDto.prototype, "overhead4", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Contingency percentage',
        example: 0.025,
        minimum: 0,
        maximum: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    (0, _classvalidator.Max)(1),
    _ts_metadata("design:type", Number)
], UpdatePricingConfigDto.prototype, "contingency", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Profit margin percentage',
        example: 0.22,
        minimum: 0,
        maximum: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    (0, _classvalidator.Max)(1),
    _ts_metadata("design:type", Number)
], UpdatePricingConfigDto.prototype, "profitMargin", void 0);

//# sourceMappingURL=update-pricing-config.dto.js.map
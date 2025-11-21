"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateEdgeBandingDto", {
    enumerable: true,
    get: function() {
        return CreateEdgeBandingDto;
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
let CreateEdgeBandingDto = class CreateEdgeBandingDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Unique edge banding code',
        example: 'EDGE001'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateEdgeBandingDto.prototype, "code", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Edge banding description',
        example: 'PVC Edge 2mm White'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateEdgeBandingDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Unit of measurement',
        example: 'm'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateEdgeBandingDto.prototype, "unit", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Price per unit',
        example: 3500
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], CreateEdgeBandingDto.prototype, "unitPrice", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is edge banding active',
        example: true,
        default: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateEdgeBandingDto.prototype, "isActive", void 0);

//# sourceMappingURL=create-edge-banding.dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCNCOperationDto", {
    enumerable: true,
    get: function() {
        return CreateCNCOperationDto;
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
let CreateCNCOperationDto = class CreateCNCOperationDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Unique CNC operation code',
        example: 'CNC001'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCNCOperationDto.prototype, "code", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'CNC operation description',
        example: 'Drilling Operation'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCNCOperationDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Unit of measurement',
        example: 'piece'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateCNCOperationDto.prototype, "unit", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Price per unit',
        example: 5000
    }),
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], CreateCNCOperationDto.prototype, "unitPrice", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        description: 'Is CNC operation active',
        example: true,
        default: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], CreateCNCOperationDto.prototype, "isActive", void 0);

//# sourceMappingURL=create-cnc-operation.dto.js.map
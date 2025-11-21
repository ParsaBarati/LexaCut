"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PricingConfigController", {
    enumerable: true,
    get: function() {
        return PricingConfigController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _prismaservice = require("../../prisma/prisma.service");
const _updatepricingconfigdto = require("./dto/update-pricing-config.dto");
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
let PricingConfigController = class PricingConfigController {
    async getActive() {
        return this.prisma.pricingConfig.findFirst({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async update(updateDto) {
        // Get the active config or create default
        let config = await this.prisma.pricingConfig.findFirst({
            where: {
                name: 'default'
            }
        });
        if (!config) {
            config = await this.prisma.pricingConfig.create({
                data: {
                    name: 'default',
                    isActive: true
                }
            });
        }
        return this.prisma.pricingConfig.update({
            where: {
                id: config.id
            },
            data: updateDto
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get active pricing configuration'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns the active pricing configuration'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], PricingConfigController.prototype, "getActive", null);
_ts_decorate([
    (0, _common.Put)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update pricing configuration'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Pricing configuration updated successfully'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updatepricingconfigdto.UpdatePricingConfigDto === "undefined" ? Object : _updatepricingconfigdto.UpdatePricingConfigDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PricingConfigController.prototype, "update", null);
PricingConfigController = _ts_decorate([
    (0, _swagger.ApiTags)('Pricing Configuration'),
    (0, _common.Controller)('api/v1/pricing-config'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], PricingConfigController);

//# sourceMappingURL=pricing-config.controller.js.map
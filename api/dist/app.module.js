"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _costcalculationmodule = require("./modules/cost-calculation/cost-calculation.module");
const _materialsmodule = require("./modules/materials/materials.module");
const _pricingmodule = require("./modules/pricing/pricing.module");
const _prismamodule = require("./prisma/prisma.module");
const _edgebandingmodule = require("./modules/edge-banding/edge-banding.module");
const _cncoperationsmodule = require("./modules/cnc-operations/cnc-operations.module");
const _fittingsmodule = require("./modules/fittings/fittings.module");
const _pricingconfigmodule = require("./modules/pricing-config/pricing-config.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _costcalculationmodule.CostCalculationModule,
            _materialsmodule.MaterialsModule,
            _pricingmodule.PricingModule,
            _edgebandingmodule.EdgeBandingModule,
            _cncoperationsmodule.CNCOperationsModule,
            _fittingsmodule.FittingsModule,
            _pricingconfigmodule.PricingConfigModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map
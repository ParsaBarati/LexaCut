"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CostCalculationModule", {
    enumerable: true,
    get: function() {
        return CostCalculationModule;
    }
});
const _common = require("@nestjs/common");
const _costcalculationservice = require("./cost-calculation.service");
const _costcalculationcontroller = require("./cost-calculation.controller");
const _materialsmodule = require("../materials/materials.module");
const _pricingmodule = require("../pricing/pricing.module");
const _pricinglookupservice = require("../../common/utils/pricing-lookup.service");
const _dataprocessingservice = require("./data-processing.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CostCalculationModule = class CostCalculationModule {
};
CostCalculationModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _materialsmodule.MaterialsModule,
            _pricingmodule.PricingModule
        ],
        controllers: [
            _costcalculationcontroller.CostCalculationController
        ],
        providers: [
            _costcalculationservice.CostCalculationService,
            _dataprocessingservice.DataProcessingService,
            _pricinglookupservice.PricingLookupService
        ],
        exports: [
            _costcalculationservice.CostCalculationService
        ]
    })
], CostCalculationModule);

//# sourceMappingURL=cost-calculation.module.js.map
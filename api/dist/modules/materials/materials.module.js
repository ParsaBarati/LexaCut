"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MaterialsModule", {
    enumerable: true,
    get: function() {
        return MaterialsModule;
    }
});
const _common = require("@nestjs/common");
const _materialsservice = require("./materials.service");
const _materialscontroller = require("./materials.controller");
const _pricinglookupservice = require("../../common/utils/pricing-lookup.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MaterialsModule = class MaterialsModule {
};
MaterialsModule = _ts_decorate([
    (0, _common.Module)({
        controllers: [
            _materialscontroller.MaterialsController
        ],
        providers: [
            _materialsservice.MaterialsService,
            _pricinglookupservice.PricingLookupService
        ],
        exports: [
            _materialsservice.MaterialsService
        ]
    })
], MaterialsModule);

//# sourceMappingURL=materials.module.js.map
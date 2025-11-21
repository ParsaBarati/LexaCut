"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CNCOperationsModule", {
    enumerable: true,
    get: function() {
        return CNCOperationsModule;
    }
});
const _common = require("@nestjs/common");
const _cncoperationscontroller = require("./cnc-operations.controller");
const _cncoperationsservice = require("./cnc-operations.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CNCOperationsModule = class CNCOperationsModule {
};
CNCOperationsModule = _ts_decorate([
    (0, _common.Module)({
        controllers: [
            _cncoperationscontroller.CNCOperationsController
        ],
        providers: [
            _cncoperationsservice.CNCOperationsService
        ],
        exports: [
            _cncoperationsservice.CNCOperationsService
        ]
    })
], CNCOperationsModule);

//# sourceMappingURL=cnc-operations.module.js.map
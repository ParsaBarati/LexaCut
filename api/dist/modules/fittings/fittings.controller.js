"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FittingsController", {
    enumerable: true,
    get: function() {
        return FittingsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _prismaservice = require("../../prisma/prisma.service");
const _createfittingdto = require("./dto/create-fitting.dto");
const _updatefittingdto = require("./dto/update-fitting.dto");
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
let FittingsController = class FittingsController {
    async findAll(active) {
        const where = active === 'true' ? {
            isActive: true
        } : {};
        return this.prisma.fitting.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findOne(id) {
        return this.prisma.fitting.findUniqueOrThrow({
            where: {
                id
            }
        });
    }
    async create(createDto) {
        return this.prisma.fitting.create({
            data: createDto
        });
    }
    async bulkCreate(createDtos) {
        const result = await this.prisma.fitting.createMany({
            data: createDtos,
            skipDuplicates: true
        });
        return {
            count: result.count,
            message: `Successfully created ${result.count} fittings`
        };
    }
    async update(id, updateDto) {
        return this.prisma.fitting.update({
            where: {
                id
            },
            data: updateDto
        });
    }
    async remove(id) {
        await this.prisma.fitting.update({
            where: {
                id
            },
            data: {
                isActive: false
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all fittings'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all fittings'
    }),
    _ts_param(0, (0, _common.Query)('active')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FittingsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get fitting by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns the fitting'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Fitting not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FittingsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new fitting'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Fitting created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createfittingdto.CreateFittingDto === "undefined" ? Object : _createfittingdto.CreateFittingDto
    ]),
    _ts_metadata("design:returntype", Promise)
], FittingsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Post)('bulk'),
    (0, _swagger.ApiOperation)({
        summary: 'Bulk create fittings'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Fittings created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], FittingsController.prototype, "bulkCreate", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update a fitting'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Fitting updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Fitting not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updatefittingdto.UpdateFittingDto === "undefined" ? Object : _updatefittingdto.UpdateFittingDto
    ]),
    _ts_metadata("design:returntype", Promise)
], FittingsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.HttpCode)(_common.HttpStatus.NO_CONTENT),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a fitting (soft delete)'
    }),
    (0, _swagger.ApiResponse)({
        status: 204,
        description: 'Fitting deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Fitting not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FittingsController.prototype, "remove", null);
FittingsController = _ts_decorate([
    (0, _swagger.ApiTags)('Fittings Management'),
    (0, _common.Controller)('api/v1/fittings'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], FittingsController);

//# sourceMappingURL=fittings.controller.js.map
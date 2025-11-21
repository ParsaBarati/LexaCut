"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CNCOperationsController", {
    enumerable: true,
    get: function() {
        return CNCOperationsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _prismaservice = require("../../prisma/prisma.service");
const _createcncoperationdto = require("./dto/create-cnc-operation.dto");
const _updatecncoperationdto = require("./dto/update-cnc-operation.dto");
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
let CNCOperationsController = class CNCOperationsController {
    async findAll(active) {
        const where = active === 'true' ? {
            isActive: true
        } : {};
        return this.prisma.cNCOperation.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findOne(id) {
        return this.prisma.cNCOperation.findUniqueOrThrow({
            where: {
                id
            }
        });
    }
    async create(createDto) {
        return this.prisma.cNCOperation.create({
            data: createDto
        });
    }
    async bulkCreate(createDtos) {
        const result = await this.prisma.cNCOperation.createMany({
            data: createDtos,
            skipDuplicates: true
        });
        return {
            count: result.count,
            message: `Successfully created ${result.count} CNC operations`
        };
    }
    async update(id, updateDto) {
        return this.prisma.cNCOperation.update({
            where: {
                id
            },
            data: updateDto
        });
    }
    async remove(id) {
        await this.prisma.cNCOperation.update({
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
        summary: 'Get all CNC operations'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all CNC operations'
    }),
    _ts_param(0, (0, _common.Query)('active')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CNCOperationsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get CNC operation by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns the CNC operation'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'CNC operation not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CNCOperationsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new CNC operation'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'CNC operation created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createcncoperationdto.CreateCNCOperationDto === "undefined" ? Object : _createcncoperationdto.CreateCNCOperationDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CNCOperationsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Post)('bulk'),
    (0, _swagger.ApiOperation)({
        summary: 'Bulk create CNC operations'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'CNC operations created successfully'
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
], CNCOperationsController.prototype, "bulkCreate", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update a CNC operation'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'CNC operation updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'CNC operation not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updatecncoperationdto.UpdateCNCOperationDto === "undefined" ? Object : _updatecncoperationdto.UpdateCNCOperationDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CNCOperationsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.HttpCode)(_common.HttpStatus.NO_CONTENT),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a CNC operation (soft delete)'
    }),
    (0, _swagger.ApiResponse)({
        status: 204,
        description: 'CNC operation deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'CNC operation not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CNCOperationsController.prototype, "remove", null);
CNCOperationsController = _ts_decorate([
    (0, _swagger.ApiTags)('CNC Operations Management'),
    (0, _common.Controller)('api/v1/cnc-operations'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CNCOperationsController);

//# sourceMappingURL=cnc-operations.controller.js.map
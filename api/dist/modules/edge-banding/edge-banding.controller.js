"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EdgeBandingController", {
    enumerable: true,
    get: function() {
        return EdgeBandingController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _prismaservice = require("../../prisma/prisma.service");
const _createedgebandingdto = require("./dto/create-edge-banding.dto");
const _updateedgebandingdto = require("./dto/update-edge-banding.dto");
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
let EdgeBandingController = class EdgeBandingController {
    async findAll(active) {
        const where = active === 'true' ? {
            isActive: true
        } : {};
        return this.prisma.edgeBanding.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findOne(id) {
        return this.prisma.edgeBanding.findUniqueOrThrow({
            where: {
                id
            }
        });
    }
    async create(createDto) {
        return this.prisma.edgeBanding.create({
            data: createDto
        });
    }
    async bulkCreate(createDtos) {
        const result = await this.prisma.edgeBanding.createMany({
            data: createDtos,
            skipDuplicates: true
        });
        return {
            count: result.count,
            message: `Successfully created ${result.count} edge banding types`
        };
    }
    async update(id, updateDto) {
        return this.prisma.edgeBanding.update({
            where: {
                id
            },
            data: updateDto
        });
    }
    async remove(id) {
        await this.prisma.edgeBanding.update({
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
        summary: 'Get all edge banding types'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all edge banding types'
    }),
    _ts_param(0, (0, _common.Query)('active')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EdgeBandingController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get edge banding by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns the edge banding'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Edge banding not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EdgeBandingController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new edge banding type'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Edge banding created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createedgebandingdto.CreateEdgeBandingDto === "undefined" ? Object : _createedgebandingdto.CreateEdgeBandingDto
    ]),
    _ts_metadata("design:returntype", Promise)
], EdgeBandingController.prototype, "create", null);
_ts_decorate([
    (0, _common.Post)('bulk'),
    (0, _swagger.ApiOperation)({
        summary: 'Bulk create edge banding types'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Edge banding types created successfully'
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
], EdgeBandingController.prototype, "bulkCreate", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update an edge banding type'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Edge banding updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Edge banding not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateedgebandingdto.UpdateEdgeBandingDto === "undefined" ? Object : _updateedgebandingdto.UpdateEdgeBandingDto
    ]),
    _ts_metadata("design:returntype", Promise)
], EdgeBandingController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.HttpCode)(_common.HttpStatus.NO_CONTENT),
    (0, _swagger.ApiOperation)({
        summary: 'Delete an edge banding type (soft delete)'
    }),
    (0, _swagger.ApiResponse)({
        status: 204,
        description: 'Edge banding deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Edge banding not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], EdgeBandingController.prototype, "remove", null);
EdgeBandingController = _ts_decorate([
    (0, _swagger.ApiTags)('Edge Banding Management'),
    (0, _common.Controller)('api/v1/edge-banding'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], EdgeBandingController);

//# sourceMappingURL=edge-banding.controller.js.map
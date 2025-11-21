"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MaterialsController", {
    enumerable: true,
    get: function() {
        return MaterialsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _prismaservice = require("../../prisma/prisma.service");
const _creatematerialdto = require("./dto/create-material.dto");
const _updatematerialdto = require("./dto/update-material.dto");
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
let MaterialsController = class MaterialsController {
    async findAll(active) {
        const where = active === 'true' ? {
            isActive: true
        } : {};
        return this.prisma.material.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findOne(id) {
        return this.prisma.material.findUniqueOrThrow({
            where: {
                id
            }
        });
    }
    async create(createDto) {
        return this.prisma.material.create({
            data: createDto
        });
    }
    async bulkCreate(createDtos) {
        const result = await this.prisma.material.createMany({
            data: createDtos,
            skipDuplicates: true
        });
        return {
            count: result.count,
            message: `Successfully created ${result.count} materials`
        };
    }
    async update(id, updateDto) {
        return this.prisma.material.update({
            where: {
                id
            },
            data: updateDto
        });
    }
    async remove(id) {
        // Soft delete by setting isActive to false
        await this.prisma.material.update({
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
        summary: 'Get all materials'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns all materials'
    }),
    _ts_param(0, (0, _common.Query)('active')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MaterialsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get material by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns the material'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Material not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MaterialsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new material'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Material created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _creatematerialdto.CreateMaterialDto === "undefined" ? Object : _creatematerialdto.CreateMaterialDto
    ]),
    _ts_metadata("design:returntype", Promise)
], MaterialsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Post)('bulk'),
    (0, _swagger.ApiOperation)({
        summary: 'Bulk create materials'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Materials created successfully'
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
], MaterialsController.prototype, "bulkCreate", null);
_ts_decorate([
    (0, _common.Put)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update a material'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Material updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Material not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updatematerialdto.UpdateMaterialDto === "undefined" ? Object : _updatematerialdto.UpdateMaterialDto
    ]),
    _ts_metadata("design:returntype", Promise)
], MaterialsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _common.HttpCode)(_common.HttpStatus.NO_CONTENT),
    (0, _swagger.ApiOperation)({
        summary: 'Delete a material (soft delete)'
    }),
    (0, _swagger.ApiResponse)({
        status: 204,
        description: 'Material deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Material not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MaterialsController.prototype, "remove", null);
MaterialsController = _ts_decorate([
    (0, _swagger.ApiTags)('Materials Management'),
    (0, _common.Controller)('api/v1/materials'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], MaterialsController);

//# sourceMappingURL=materials.controller.js.map
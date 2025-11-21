"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CNCOperationsService", {
    enumerable: true,
    get: function() {
        return CNCOperationsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CNCOperationsService = class CNCOperationsService {
    async findAll(activeOnly = true) {
        return this.prisma.cNCOperation.findMany({
            where: activeOnly ? {
                isActive: true
            } : {},
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
    async update(id, updateDto) {
        return this.prisma.cNCOperation.update({
            where: {
                id
            },
            data: updateDto
        });
    }
    async remove(id) {
        return this.prisma.cNCOperation.update({
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
CNCOperationsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CNCOperationsService);

//# sourceMappingURL=cnc-operations.service.js.map
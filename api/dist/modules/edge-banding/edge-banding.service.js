"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EdgeBandingService", {
    enumerable: true,
    get: function() {
        return EdgeBandingService;
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
let EdgeBandingService = class EdgeBandingService {
    async findAll(activeOnly = true) {
        return this.prisma.edgeBanding.findMany({
            where: activeOnly ? {
                isActive: true
            } : {},
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
    async update(id, updateDto) {
        return this.prisma.edgeBanding.update({
            where: {
                id
            },
            data: updateDto
        });
    }
    async remove(id) {
        return this.prisma.edgeBanding.update({
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
EdgeBandingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], EdgeBandingService);

//# sourceMappingURL=edge-banding.service.js.map
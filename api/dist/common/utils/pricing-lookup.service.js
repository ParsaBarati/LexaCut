"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PricingLookupService", {
    enumerable: true,
    get: function() {
        return PricingLookupService;
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
let PricingLookupService = class PricingLookupService {
    /**
   * Lookup material by code
   * Replaces: VLOOKUP in Material sheet (W:Z range)
   */ async getMaterialByCode(code) {
        return this.prisma.material.findUnique({
            where: {
                code,
                isActive: true
            }
        });
    }
    /**
   * Lookup material by name/description (handles Persian names)
   * Matches Persian material names from CSV to pricing table
   */ async getMaterialByName(name) {
        if (!name) return undefined;
        const normalizedName = name.trim().toLowerCase();
        // Try exact match first on description or code
        let material = await this.prisma.material.findFirst({
            where: {
                OR: [
                    {
                        description: {
                            contains: normalizedName,
                            mode: 'insensitive'
                        }
                    },
                    {
                        code: {
                            equals: normalizedName,
                            mode: 'insensitive'
                        }
                    }
                ],
                isActive: true
            }
        });
        if (material) return material;
        // Check persianNames array
        const materials = await this.prisma.material.findMany({
            where: {
                isActive: true
            }
        });
        for (const m of materials){
            if (m.persianNames.some((pn)=>normalizedName.includes(pn.toLowerCase()) || pn.toLowerCase().includes(normalizedName))) {
                return m;
            }
        }
        // Fallback: return first MDF material or first material
        const fallback = await this.prisma.material.findFirst({
            where: {
                OR: [
                    {
                        description: {
                            contains: 'mdf',
                            mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            contains: 'ام',
                            mode: 'insensitive'
                        }
                    }
                ],
                isActive: true
            }
        });
        return fallback || materials[0];
    }
    /**
   * Get all active materials
   */ async getAllMaterials() {
        return this.prisma.material.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                description: 'asc'
            }
        });
    }
    /**
   * Lookup edge banding by code
   * Replaces: VLOOKUP in BoreshKari sheet (W:Y range)
   */ async getEdgeBandingByCode(code) {
        return this.prisma.edgeBanding.findUnique({
            where: {
                code,
                isActive: true
            }
        });
    }
    /**
   * Get all active edge banding options
   */ async getAllEdgeBanding() {
        return this.prisma.edgeBanding.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                description: 'asc'
            }
        });
    }
    /**
   * Lookup CNC operation by code
   */ async getCNCOperationByCode(code) {
        return this.prisma.cNCOperation.findUnique({
            where: {
                code,
                isActive: true
            }
        });
    }
    /**
   * Get all active CNC operations
   */ async getAllCNCOperations() {
        return this.prisma.cNCOperation.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                description: 'asc'
            }
        });
    }
    /**
   * Lookup cutting operation by code
   */ async getCuttingByCode(code) {
        // For now, using CNC operations for cutting
        return this.getCNCOperationByCode(code);
    }
    /**
   * Lookup fitting by code
   * Replaces: VLOOKUP in Fittings sheet (W:X range)
   */ async getFittingByCode(code) {
        return this.prisma.fitting.findUnique({
            where: {
                code,
                isActive: true
            }
        });
    }
    /**
   * Get all active fittings
   */ async getAllFittings() {
        return this.prisma.fitting.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    }
    /**
   * Lookup fitting by name (handles Persian names)
   * Matches Persian fitting names from components to pricing table
   */ async getFittingByName(name) {
        if (!name) return undefined;
        const normalizedName = name.trim().toLowerCase();
        // Try exact match first on name or code
        const fitting = await this.prisma.fitting.findFirst({
            where: {
                OR: [
                    {
                        name: {
                            contains: normalizedName,
                            mode: 'insensitive'
                        }
                    },
                    {
                        code: {
                            equals: normalizedName,
                            mode: 'insensitive'
                        }
                    }
                ],
                isActive: true
            }
        });
        return fitting;
    }
    /**
   * Get color by code (placeholder - colors can be added to DB later)
   */ getColorByCode(code) {
        const colorMap = {
            COL001: 'White',
            COL002: 'Black',
            COL003: 'Oak',
            COL004: 'Walnut'
        };
        return colorMap[code];
    }
    /**
   * Search materials by description
   */ async searchMaterials(query) {
        return this.prisma.material.findMany({
            where: {
                description: {
                    contains: query,
                    mode: 'insensitive'
                },
                isActive: true
            },
            orderBy: {
                description: 'asc'
            }
        });
    }
    /**
   * Get materials by category
   */ async getMaterialsByCategory(category) {
        return this.prisma.material.findMany({
            where: {
                category,
                isActive: true
            },
            orderBy: {
                description: 'asc'
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
PricingLookupService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], PricingLookupService);

//# sourceMappingURL=pricing-lookup.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PricingService", {
    enumerable: true,
    get: function() {
        return PricingService;
    }
});
const _common = require("@nestjs/common");
const _excelfunctions = require("../../common/utils/excel-functions");
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
let PricingService = class PricingService {
    /**
   * Get active pricing configuration from database
   */ async getActiveConfig() {
        const dbConfig = await this.prisma.pricingConfig.findFirst({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (dbConfig) {
            return {
                overhead1: dbConfig.overhead1,
                overhead2: dbConfig.overhead2,
                overhead3: dbConfig.overhead3,
                overhead4: dbConfig.overhead4,
                contingency: dbConfig.contingency,
                profitMargin: dbConfig.profitMargin
            };
        }
        return this.defaultConfig;
    }
    /**
   * Calculate complete financial summary with overheads and profit
   * Exactly matches Excel "روکش مالی" sheet calculations
   * 
   * @param costs - Complete cost breakdown from all categories
   * @param config - Optional custom pricing configuration
   * @returns Complete financial summary with final price
   */ async calculateFinancialSummary(costs, config) {
        // Load config from database if not provided
        const activeConfig = await this.getActiveConfig();
        const pricingConfig = {
            ...activeConfig,
            ...config
        };
        // Extract individual category costs
        // Maps to روکش مالی sheet cells A7-A14
        const breakdown = {
            material: costs.material.totalCost,
            boreshKari: costs.boreshKari.totalCost,
            navarShiar: costs.navarShiar.totalCost,
            cnc: costs.cnc.totalCost,
            fittings: costs.fittings.totalCost,
            painting: costs.painting.totalCost,
            woodTools: costs.woodTools.totalCost,
            plate: costs.plate.totalCost
        };
        // Calculate subtotal (SUM of all category costs)
        // روکش مالی!SUM(A7:A26) - though only A7-A14 have values
        const subtotal = (0, _excelfunctions.sum)(Object.values(breakdown));
        // Calculate overheads
        // روکش مالی!A27-A31
        const overhead1 = subtotal * pricingConfig.overhead1; // A27
        const overhead2 = subtotal * pricingConfig.overhead2; // A28
        const overhead3 = subtotal * pricingConfig.overhead3; // A29
        const overhead4 = subtotal * pricingConfig.overhead4; // A30
        const contingency = subtotal * pricingConfig.contingency; // A31
        const totalOverheads = (0, _excelfunctions.sum)([
            overhead1,
            overhead2,
            overhead3,
            overhead4,
            contingency
        ]);
        // Calculate total with overheads
        // روکش مالی!A32 = SUM(A7:A26) + SUM(A27:A31)
        const totalWithOverheads = subtotal + totalOverheads;
        // Calculate profit amount
        const profitAmount = totalWithOverheads * pricingConfig.profitMargin;
        // Calculate final price with profit (22%)
        // روکش مالی!A33 = A32 + (A32 * 0.22)
        const finalPrice = totalWithOverheads + profitAmount;
        return {
            subtotal,
            breakdown,
            overheads: {
                overhead1,
                overhead2,
                overhead3,
                overhead4,
                contingency,
                totalOverheads
            },
            totalWithOverheads,
            finalPrice,
            profitAmount,
            profitPercentage: pricingConfig.profitMargin
        };
    }
    /**
   * Get default pricing configuration
   */ getDefaultConfig() {
        return {
            ...this.defaultConfig
        };
    }
    /**
   * Update pricing configuration
   */ setConfig(config) {
        this.defaultConfig = {
            ...this.defaultConfig,
            ...config
        };
    }
    /**
   * Calculate just the overhead amount for a given subtotal
   * Used in intermediate calculations
   */ calculateOverheads(subtotal, config) {
        const pricingConfig = {
            ...this.defaultConfig,
            ...config
        };
        return subtotal * pricingConfig.overhead1 + subtotal * pricingConfig.overhead2 + subtotal * pricingConfig.overhead3 + subtotal * pricingConfig.overhead4 + subtotal * pricingConfig.contingency;
    }
    /**
   * Calculate final price from subtotal (including overheads and profit)
   * Quick calculation without full breakdown
   */ calculateFinalPriceFromSubtotal(subtotal, config) {
        const overheads = this.calculateOverheads(subtotal, config);
        const totalWithOverheads = subtotal + overheads;
        const pricingConfig = {
            ...this.defaultConfig,
            ...config
        };
        return totalWithOverheads * (1 + pricingConfig.profitMargin);
    }
    /**
   * Calculate subtotal from final price (reverse calculation)
   * Useful for price verification
   */ calculateSubtotalFromFinalPrice(finalPrice, config) {
        const pricingConfig = {
            ...this.defaultConfig,
            ...config
        };
        // Calculate total overhead percentage
        const totalOverheadPercentage = pricingConfig.overhead1 + pricingConfig.overhead2 + pricingConfig.overhead3 + pricingConfig.overhead4 + pricingConfig.contingency;
        // Total multiplier: (1 + overheads) * (1 + profit)
        const totalMultiplier = (1 + totalOverheadPercentage) * (1 + pricingConfig.profitMargin);
        return finalPrice / totalMultiplier;
    }
    /**
   * Get pricing breakdown as percentages
   * Useful for reporting and visualization
   */ getPricingBreakdownPercentages(config) {
        const pricingConfig = {
            ...this.defaultConfig,
            ...config
        };
        return {
            overhead1Percent: pricingConfig.overhead1 * 100,
            overhead2Percent: pricingConfig.overhead2 * 100,
            overhead3Percent: pricingConfig.overhead3 * 100,
            overhead4Percent: pricingConfig.overhead4 * 100,
            contingencyPercent: pricingConfig.contingency * 100,
            profitPercent: pricingConfig.profitMargin * 100,
            totalOverheadPercent: (pricingConfig.overhead1 + pricingConfig.overhead2 + pricingConfig.overhead3 + pricingConfig.overhead4 + pricingConfig.contingency) * 100
        };
    }
    constructor(prisma){
        this.prisma = prisma;
        /**
   * Default pricing configuration matching Excel defaults
   * From "روکش مالی" sheet cells A27-A31
   */ this.defaultConfig = {
            overhead1: 0.25,
            overhead2: 0.04,
            overhead3: 0.02,
            overhead4: 0.02,
            contingency: 0.025,
            profitMargin: 0.22
        };
    }
};
PricingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], PricingService);

//# sourceMappingURL=pricing.service.js.map
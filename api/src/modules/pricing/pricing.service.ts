import { Injectable } from '@nestjs/common';
import {
  CostBreakdown,
  FinancialSummary,
  PricingConfig,
} from '../../common/interfaces';
import { sum } from '../../common/utils/excel-functions';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Pricing Service
 * Implements the core pricing calculations from "روکش مالی" (Financial Summary) sheet
 * This is the heart of the cost calculation engine
 */
@Injectable()
export class PricingService {
  /**
   * Default pricing configuration matching Excel defaults
   * From "روکش مالی" sheet cells A27-A31
   */
  private defaultConfig: PricingConfig = {
    overhead1: 0.25,      // روکش مالی!A27 = SUM(A7:A26) * 0.25
    overhead2: 0.04,      // روکش مالی!A28 = SUM(A7:A26) * 0.04
    overhead3: 0.02,      // روکش مالی!A29 = SUM(A7:A26) * 0.02
    overhead4: 0.02,      // روکش مالی!A30 = SUM(A7:A26) * 0.02
    contingency: 0.025,   // روکش مالی!A31 = SUM(A7:A26) * 0.025
    profitMargin: 0.22,   // روکش مالی!A33 = A32 + (A32 * 0.22)
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get active pricing configuration from database
   */
  async getActiveConfig(): Promise<PricingConfig> {
    const dbConfig = await this.prisma.pricingConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (dbConfig) {
      return {
        overhead1: dbConfig.overhead1,
        overhead2: dbConfig.overhead2,
        overhead3: dbConfig.overhead3,
        overhead4: dbConfig.overhead4,
        contingency: dbConfig.contingency,
        profitMargin: dbConfig.profitMargin,
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
   */
  async calculateFinancialSummary(
    costs: CostBreakdown,
    config?: Partial<PricingConfig>
  ): Promise<FinancialSummary> {
    // Load config from database if not provided
    const activeConfig = await this.getActiveConfig();
    const pricingConfig = { ...activeConfig, ...config };

    // Extract individual category costs
    // Maps to روکش مالی sheet cells A7-A14
    const breakdown = {
      material: costs.material.totalCost,           // روکش مالی!A7 = Material!A31
      boreshKari: costs.boreshKari.totalCost,       // روکش مالی!A8 = BoreshKari!A31
      navarShiar: costs.navarShiar.totalCost,       // روکش مالی!A9 = NavarShiarFarsi!A31
      cnc: costs.cnc.totalCost,                     // روکش مالی!A10 = CNC!A31
      fittings: costs.fittings.totalCost,           // روکش مالی!A11 = Fittings!A31
      painting: costs.painting.totalCost,           // روکش مالی!A12 = Painting!A31
      woodTools: costs.woodTools.totalCost,         // روکش مالی!A13 = WoodTools!A28
      plate: costs.plate.totalCost,                 // روکش مالی!A14 = Plate!A31
    };

    // Calculate subtotal (SUM of all category costs)
    // روکش مالی!SUM(A7:A26) - though only A7-A14 have values
    const subtotal = sum(Object.values(breakdown));

    // Calculate overheads
    // روکش مالی!A27-A31
    const overhead1 = subtotal * pricingConfig.overhead1;     // A27
    const overhead2 = subtotal * pricingConfig.overhead2;     // A28
    const overhead3 = subtotal * pricingConfig.overhead3;     // A29
    const overhead4 = subtotal * pricingConfig.overhead4;     // A30
    const contingency = subtotal * pricingConfig.contingency; // A31

    const totalOverheads = sum([
      overhead1,
      overhead2,
      overhead3,
      overhead4,
      contingency,
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
        totalOverheads,
      },
      totalWithOverheads,
      finalPrice,
      profitAmount,
      profitPercentage: pricingConfig.profitMargin,
    };
  }

  /**
   * Get default pricing configuration
   */
  getDefaultConfig(): PricingConfig {
    return { ...this.defaultConfig };
  }

  /**
   * Update pricing configuration
   */
  setConfig(config: Partial<PricingConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Calculate just the overhead amount for a given subtotal
   * Used in intermediate calculations
   */
  calculateOverheads(
    subtotal: number,
    config?: Partial<PricingConfig>
  ): number {
    const pricingConfig = { ...this.defaultConfig, ...config };
    
    return (
      subtotal * pricingConfig.overhead1 +
      subtotal * pricingConfig.overhead2 +
      subtotal * pricingConfig.overhead3 +
      subtotal * pricingConfig.overhead4 +
      subtotal * pricingConfig.contingency
    );
  }

  /**
   * Calculate final price from subtotal (including overheads and profit)
   * Quick calculation without full breakdown
   */
  calculateFinalPriceFromSubtotal(
    subtotal: number,
    config?: Partial<PricingConfig>
  ): number {
    const overheads = this.calculateOverheads(subtotal, config);
    const totalWithOverheads = subtotal + overheads;
    const pricingConfig = { ...this.defaultConfig, ...config };
    return totalWithOverheads * (1 + pricingConfig.profitMargin);
  }

  /**
   * Calculate subtotal from final price (reverse calculation)
   * Useful for price verification
   */
  calculateSubtotalFromFinalPrice(
    finalPrice: number,
    config?: Partial<PricingConfig>
  ): number {
    const pricingConfig = { ...this.defaultConfig, ...config };
    
    // Calculate total overhead percentage
    const totalOverheadPercentage =
      pricingConfig.overhead1 +
      pricingConfig.overhead2 +
      pricingConfig.overhead3 +
      pricingConfig.overhead4 +
      pricingConfig.contingency;
    
    // Total multiplier: (1 + overheads) * (1 + profit)
    const totalMultiplier = (1 + totalOverheadPercentage) * (1 + pricingConfig.profitMargin);
    
    return finalPrice / totalMultiplier;
  }

  /**
   * Get pricing breakdown as percentages
   * Useful for reporting and visualization
   */
  getPricingBreakdownPercentages(config?: Partial<PricingConfig>): {
    overhead1Percent: number;
    overhead2Percent: number;
    overhead3Percent: number;
    overhead4Percent: number;
    contingencyPercent: number;
    profitPercent: number;
    totalOverheadPercent: number;
  } {
    const pricingConfig = { ...this.defaultConfig, ...config };
    
    return {
      overhead1Percent: pricingConfig.overhead1 * 100,
      overhead2Percent: pricingConfig.overhead2 * 100,
      overhead3Percent: pricingConfig.overhead3 * 100,
      overhead4Percent: pricingConfig.overhead4 * 100,
      contingencyPercent: pricingConfig.contingency * 100,
      profitPercent: pricingConfig.profitMargin * 100,
      totalOverheadPercent: (
        pricingConfig.overhead1 +
        pricingConfig.overhead2 +
        pricingConfig.overhead3 +
        pricingConfig.overhead4 +
        pricingConfig.contingency
      ) * 100,
    };
  }
}


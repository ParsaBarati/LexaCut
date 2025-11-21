import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CostBreakdown } from '../../common/interfaces';

describe('PricingService', () => {
  let service: PricingService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      pricingConfig: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateFinancialSummary', () => {
    it('should calculate financial summary with default config', async () => {
      // Mock no DB config (use defaults)
      prismaService.pricingConfig.findFirst.mockResolvedValue(null);

      const costs: CostBreakdown = {
        material: { category: 'Material', totalCost: 10000000, items: [], totalArea: 1.0, totalQuantity: 10 },
        boreshKari: { category: 'BoreshKari', totalCost: 0, items: [] },
        cnc: { category: 'CNC', totalCost: 500000, items: [] },
        navarShiar: { category: 'NavarShiar', totalCost: 1000000, items: [] },
        fittings: { category: 'Fittings', totalCost: 2000000, items: [] },
        painting: { category: 'Painting', totalCost: 0, items: [] },
        plate: { category: 'Plate', totalCost: 500000, items: [] },
        woodTools: { category: 'WoodTools', totalCost: 500000, items: [] },
      };

      const result = await service.calculateFinancialSummary(costs);

      // Subtotal = sum of all categories
      const expectedSubtotal = 14500000;
      expect(result.subtotal).toBe(expectedSubtotal);

      // Overhead 1 (25%)
      expect(result.overheads.overhead1).toBe(expectedSubtotal * 0.25);

      // Overhead 2 (4%)
      expect(result.overheads.overhead2).toBe(expectedSubtotal * 0.04);

      // Overhead 3 (2%)
      expect(result.overheads.overhead3).toBe(expectedSubtotal * 0.02);

      // Overhead 4 (2%)
      expect(result.overheads.overhead4).toBe(expectedSubtotal * 0.02);

      // Contingency (2.5%)
      expect(result.overheads.contingency).toBe(expectedSubtotal * 0.025);

      // Total overheads
      const expectedTotalOverheads = expectedSubtotal * (0.25 + 0.04 + 0.02 + 0.02 + 0.025);
      expect(result.overheads.totalOverheads).toBeCloseTo(expectedTotalOverheads, 0);

      // Total with overheads
      expect(result.totalWithOverheads).toBe(expectedSubtotal + expectedTotalOverheads);

      // Profit (22%)
      const expectedProfit = (expectedSubtotal + expectedTotalOverheads) * 0.22;
      expect(result.profitAmount).toBe(expectedProfit);

      // Final price
      expect(result.finalPrice).toBe(expectedSubtotal + expectedTotalOverheads + expectedProfit);

      // Profit percentage
      expect(result.profitPercentage).toBe(0.22);
    });

    it('should use custom config when provided', async () => {
      prismaService.pricingConfig.findFirst.mockResolvedValue(null);

      const costs: CostBreakdown = {
        material: { category: 'Material', totalCost: 10000000, items: [], totalArea: 1.0, totalQuantity: 10 },
        boreshKari: { category: 'BoreshKari', totalCost: 0, items: [] },
        cnc: { category: 'CNC', totalCost: 0, items: [] },
        navarShiar: { category: 'NavarShiar', totalCost: 0, items: [] },
        fittings: { category: 'Fittings', totalCost: 0, items: [] },
        painting: { category: 'Painting', totalCost: 0, items: [] },
        plate: { category: 'Plate', totalCost: 0, items: [] },
        woodTools: { category: 'WoodTools', totalCost: 0, items: [] },
      };

      const customConfig = {
        overhead1: 0.30, // Custom 30%
        profitMargin: 0.25, // Custom 25%
      };

      const result = await service.calculateFinancialSummary(costs, customConfig);

      expect(result.overheads.overhead1).toBe(10000000 * 0.30);
      expect(result.profitPercentage).toBe(0.25);
    });

    it('should use database config when available', async () => {
      prismaService.pricingConfig.findFirst.mockResolvedValue({
        id: '1',
        overhead1: 0.20,
        overhead2: 0.05,
        overhead3: 0.03,
        overhead4: 0.03,
        contingency: 0.03,
        profitMargin: 0.25,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const costs: CostBreakdown = {
        material: { category: 'Material', totalCost: 10000000, items: [], totalArea: 1.0, totalQuantity: 10 },
        boreshKari: { category: 'BoreshKari', totalCost: 0, items: [] },
        cnc: { category: 'CNC', totalCost: 0, items: [] },
        navarShiar: { category: 'NavarShiar', totalCost: 0, items: [] },
        fittings: { category: 'Fittings', totalCost: 0, items: [] },
        painting: { category: 'Painting', totalCost: 0, items: [] },
        plate: { category: 'Plate', totalCost: 0, items: [] },
        woodTools: { category: 'WoodTools', totalCost: 0, items: [] },
      };

      const result = await service.calculateFinancialSummary(costs);

      // Should use DB config (20% instead of default 25%)
      expect(result.overheads.overhead1).toBe(10000000 * 0.20);
      expect(result.profitPercentage).toBe(0.25);
    });

    it('should correctly breakdown all cost categories', async () => {
      prismaService.pricingConfig.findFirst.mockResolvedValue(null);

      const costs: CostBreakdown = {
        material: { category: 'Material', totalCost: 5000000, items: [], totalArea: 1.0, totalQuantity: 10 },
        boreshKari: { category: 'BoreshKari', totalCost: 1000000, items: [] },
        cnc: { category: 'CNC', totalCost: 2000000, items: [] },
        navarShiar: { category: 'NavarShiar', totalCost: 500000, items: [] },
        fittings: { category: 'Fittings', totalCost: 3000000, items: [] },
        painting: { category: 'Painting', totalCost: 1500000, items: [] },
        plate: { category: 'Plate', totalCost: 1000000, items: [] },
        woodTools: { category: 'WoodTools', totalCost: 500000, items: [] },
      };

      const result = await service.calculateFinancialSummary(costs);

      expect(result.breakdown.material).toBe(5000000);
      expect(result.breakdown.boreshKari).toBe(1000000);
      expect(result.breakdown.cnc).toBe(2000000);
      expect(result.breakdown.navarShiar).toBe(500000);
      expect(result.breakdown.fittings).toBe(3000000);
      expect(result.breakdown.painting).toBe(1500000);
      expect(result.breakdown.plate).toBe(1000000);
      expect(result.breakdown.woodTools).toBe(500000);
      
      // Subtotal should be sum of all
      expect(result.subtotal).toBe(14500000);
    });
  });

  describe('calculateOverheads', () => {
    it('should calculate overheads correctly', () => {
      const subtotal = 10000000;
      const overheads = service.calculateOverheads(subtotal);

      // Default config: 0.25 + 0.04 + 0.02 + 0.02 + 0.025 = 0.355
      const expected = subtotal * 0.355;
      expect(overheads).toBe(expected);
    });

    it('should use custom config for overheads', () => {
      const subtotal = 10000000;
      const customConfig = {
        overhead1: 0.30,
        overhead2: 0.05,
        overhead3: 0.03,
        overhead4: 0.03,
        contingency: 0.04,
      };

      const overheads = service.calculateOverheads(subtotal, customConfig);

      // Custom: 0.30 + 0.05 + 0.03 + 0.03 + 0.04 = 0.45
      const expected = subtotal * 0.45;
      expect(overheads).toBe(expected);
    });
  });

  describe('calculateFinalPriceFromSubtotal', () => {
    it('should calculate final price from subtotal', () => {
      const subtotal = 10000000;
      const finalPrice = service.calculateFinalPriceFromSubtotal(subtotal);

      // Overheads: 10M × 0.355 = 3,550,000
      // With overheads: 13,550,000
      // Profit (22%): 13,550,000 × 0.22 = 2,981,000
      // Final: 16,531,000
      expect(finalPrice).toBeCloseTo(16531000, -3); // Within 1000 Rials
    });
  });

  describe('calculateSubtotalFromFinalPrice', () => {
    it('should reverse calculate subtotal from final price', () => {
      const finalPrice = 16531000;
      const subtotal = service.calculateSubtotalFromFinalPrice(finalPrice);

      // Should get back approximately 10,000,000
      expect(subtotal).toBeCloseTo(10000000, -3); // Within 1000 Rials
    });

    it('should be inverse of calculateFinalPriceFromSubtotal', () => {
      const originalSubtotal = 15000000;
      const finalPrice = service.calculateFinalPriceFromSubtotal(originalSubtotal);
      const calculatedSubtotal = service.calculateSubtotalFromFinalPrice(finalPrice);

      expect(calculatedSubtotal).toBeCloseTo(originalSubtotal, -2); // Within 100 Rials
    });
  });

  describe('getPricingBreakdownPercentages', () => {
    it('should return default percentages', () => {
      const percentages = service.getPricingBreakdownPercentages();

      expect(percentages.overhead1Percent).toBe(25);
      expect(percentages.overhead2Percent).toBe(4);
      expect(percentages.overhead3Percent).toBe(2);
      expect(percentages.overhead4Percent).toBe(2);
      expect(percentages.contingencyPercent).toBe(2.5);
      expect(percentages.profitPercent).toBe(22);
      expect(percentages.totalOverheadPercent).toBeCloseTo(35.5, 1);
    });

    it('should return custom percentages when provided', () => {
      const customConfig = {
        overhead1: 0.30,
        profitMargin: 0.25,
      };

      const percentages = service.getPricingBreakdownPercentages(customConfig);

      expect(percentages.overhead1Percent).toBe(30);
      expect(percentages.profitPercent).toBe(25);
    });
  });

  describe('getDefaultConfig', () => {
    it('should return default configuration', () => {
      const config = service.getDefaultConfig();

      expect(config.overhead1).toBe(0.25);
      expect(config.overhead2).toBe(0.04);
      expect(config.overhead3).toBe(0.02);
      expect(config.overhead4).toBe(0.02);
      expect(config.contingency).toBe(0.025);
      expect(config.profitMargin).toBe(0.22);
    });
  });
});


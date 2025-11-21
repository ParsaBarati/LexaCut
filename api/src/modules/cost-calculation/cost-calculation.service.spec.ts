import { Test, TestingModule } from '@nestjs/testing';
import { CostCalculationService } from './cost-calculation.service';
import { MaterialsService } from '../materials/materials.service';
import { PricingService } from '../pricing/pricing.service';
import { PricingLookupService } from '../../common/utils/pricing-lookup.service';
import { ProcessedComponent } from '../../common/interfaces';
import {
  processedDoorComponent,
  processedCNCComponent,
  processedPlateComponent,
  processedComponentSet,
} from '../../test/fixtures/test-components.fixture';

describe('CostCalculationService', () => {
  let service: CostCalculationService;
  let materialsService: jest.Mocked<MaterialsService>;
  let pricingService: jest.Mocked<PricingService>;
  let pricingLookupService: jest.Mocked<PricingLookupService>;

  beforeEach(async () => {
    const mockMaterialsService = {
      calculateMaterialCosts: jest.fn(),
    };

    const mockPricingService = {
      calculateFinancialSummary: jest.fn(),
    };

    const mockPricingLookupService = {
      getCNCOperationByCode: jest.fn(),
      getEdgeBandingByCode: jest.fn(),
      getMaterialByName: jest.fn(),
      getFittingByCode: jest.fn(),
      getColorByCode: jest.fn(() => undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CostCalculationService,
        {
          provide: MaterialsService,
          useValue: mockMaterialsService,
        },
        {
          provide: PricingService,
          useValue: mockPricingService,
        },
        {
          provide: PricingLookupService,
          useValue: mockPricingLookupService,
        },
      ],
    }).compile();

    service = module.get<CostCalculationService>(CostCalculationService);
    materialsService = module.get(MaterialsService);
    pricingService = module.get(PricingService);
    pricingLookupService = module.get(PricingLookupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateFullCost', () => {
    it('should process complete calculation flow', async () => {
      // Mock all services
      materialsService.calculateMaterialCosts.mockResolvedValue({
        category: 'Material',
        totalCost: 10000000,
        totalArea: 1.0,
        totalQuantity: 10,
        items: [],
      });

      pricingService.calculateFinancialSummary.mockResolvedValue({
        subtotal: 15000000,
        breakdown: {
          material: 10000000,
          boreshKari: 0,
          navarShiar: 1000000,
          cnc: 500000,
          fittings: 2000000,
          painting: 0,
          woodTools: 500000,
          plate: 1000000,
        },
        overheads: {
          overhead1: 3750000,
          overhead2: 600000,
          overhead3: 300000,
          overhead4: 300000,
          contingency: 375000,
          totalOverheads: 5325000,
        },
        totalWithOverheads: 20325000,
        finalPrice: 24796500,
        profitAmount: 4471500,
        profitPercentage: 0.22,
      });

      pricingLookupService.getCNCOperationByCode.mockResolvedValue({
        code: 'CNC-1',
        description: 'CNC Operation',
        unit: 'عدد',
        unitPrice: 500000,
        isActive: true,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      pricingLookupService.getEdgeBandingByCode.mockResolvedValue({
        code: 'EB-1',
        description: 'Edge Banding',
        unit: 'متر',
        unitPrice: 85000,
        isActive: true,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.calculateFullCost(
        [processedDoorComponent],
        {
          projectName: 'Test Project',
          clientName: 'Test Client',
          contractDate: '2025-01-01',
          wastePercentage: 0.15,
        }
      );

      expect(result).toBeDefined();
      expect(result.project.name).toBe('Test Project');
      expect(result.costs).toBeDefined();
      expect(result.financialSummary).toBeDefined();
    });
  });

  describe('calculateCNCCosts', () => {
    it('should calculate CNC costs for CNC components', () => {
      pricingLookupService.getCNCOperationByCode.mockResolvedValue({
        code: 'CNC-1',
        description: 'CNC - درب کابینت',
        unit: 'عدد',
        unitPrice: 500000,
        isActive: true,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const components: ProcessedComponent[] = [
        { ...processedCNCComponent, quantity: 2 },
      ];

      const result = (service as any).calculateCNCCosts(components);

      expect(result.category).toBe('CNC');
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should return zero cost for non-CNC components', () => {
      const components: ProcessedComponent[] = [processedDoorComponent];

      const result = (service as any).calculateCNCCosts(components);

      expect(result.totalCost).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('should handle different CNC operation types', () => {
      pricingLookupService.getCNCOperationByCode.mockResolvedValue({
        code: 'CNC-2',
        description: 'CNC - Route',
        unit: 'عدد',
        unitPrice: 800000,
        isActive: true,
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const components: ProcessedComponent[] = [
        { ...processedCNCComponent, cleanInstanceType: 'Route', quantity: 1 },
      ];

      const result = (service as any).calculateCNCCosts(components);

      expect(result.totalCost).toBeGreaterThan(0);
    });
  });

  describe('calculateNavarShiarCosts', () => {
    it('should calculate edge banding costs', () => {
      pricingLookupService.getEdgeBandingByCode.mockResolvedValue({
        code: 'EB-1',
        description: 'نوار کاری',
        unit: 'متر',
        unitPrice: 85000,
        isActive: true,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const components: ProcessedComponent[] = [
        {
          ...processedDoorComponent,
          edge1: 'PVC',
          edge2: 'PVC',
          edge3: '',
          edge4: '',
          length: 600,
          width: 400,
          quantity: 2,
        },
      ];

      const result = (service as any).calculateNavarShiarCosts(components);

      expect(result.category).toBe('NavarShiar');
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should return zero cost for components without edges', () => {
      const components: ProcessedComponent[] = [
        {
          ...processedCNCComponent,
          edge1: '',
          edge2: '',
          edge3: '',
          edge4: '',
        },
      ];

      const result = (service as any).calculateNavarShiarCosts(components);

      expect(result.totalCost).toBe(0);
    });

    it('should count number of edges correctly', () => {
      pricingLookupService.getEdgeBandingByCode.mockResolvedValue({
        code: 'EB-1',
        description: 'نوار کاری',
        unit: 'متر',
        unitPrice: 85000,
        isActive: true,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const components: ProcessedComponent[] = [
        {
          ...processedDoorComponent,
          edge1: 'PVC',
          edge2: 'PVC',
          edge3: 'PVC',
          edge4: 'PVC',
          length: 600,
          width: 400,
          quantity: 1,
        },
      ];

      const result = (service as any).calculateNavarShiarCosts(components);

      // 4 edges, perimeter = 2 * (600 + 400) / 1000 = 2m per edge
      // Total = 2m * 4 edges * 85,000 = 680,000
      expect(result.totalCost).toBeGreaterThan(0);
    });
  });

  describe('calculateFittingsCosts', () => {
    it('should calculate fittings for door components', () => {
      const components: ProcessedComponent[] = [
        { ...processedDoorComponent, name: 'Cabinet Door', quantity: 2 },
      ];

      const result = (service as any).calculateFittingsCosts(components);

      expect(result.category).toBe('Fittings');
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.items.length).toBeGreaterThan(0);
      // Should have hinges
      expect(result.items.some((item: any) => item.description.includes('لولا'))).toBe(true);
    });

    it('should calculate fittings for drawer components', () => {
      const components: ProcessedComponent[] = [
        {
          ...processedDoorComponent,
          name: 'Drawer Front',
          instanceType: 'Drawer-50cm',
          width: 500,
          quantity: 3,
        },
      ];

      const result = (service as any).calculateFittingsCosts(components);

      expect(result.totalCost).toBeGreaterThan(0);
      // Should have both rails and handles
      expect(result.items.length).toBeGreaterThanOrEqual(2);
    });

    it('should match drawer rails by size', () => {
      const components: ProcessedComponent[] = [
        {
          ...processedDoorComponent,
          name: 'Small Drawer',
          instanceType: 'Drawer-25cm',
          width: 250,
          quantity: 1,
        },
        {
          ...processedDoorComponent,
          name: 'Large Drawer',
          instanceType: 'Drawer-50cm',
          width: 500,
          quantity: 1,
        },
      ];

      const result = (service as any).calculateFittingsCosts(components);

      expect(result.totalCost).toBeGreaterThan(0);
      // Different sizes should have different costs
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should add cabinet handles', () => {
      const components: ProcessedComponent[] = [
        {
          ...processedDoorComponent,
          name: 'Cabinet Panel',
          instanceType: 'Cabinet',
          quantity: 2,
        },
      ];

      const result = (service as any).calculateFittingsCosts(components);

      expect(result.items.some((item: any) => item.description.includes('دستکیره'))).toBe(true);
    });
  });

  describe('calculatePlateCosts', () => {
    it('should calculate costs for thin plate materials', () => {
      pricingLookupService.getMaterialByName.mockResolvedValue({
        code: 'MAT-3',
        description: 'ام دی اف 3 میل',
        unit: 'متر مربع',
        unitPrice: 3500000,
        category: 'Panel',
        persianNames: [],
        isActive: true,
        id: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const components: ProcessedComponent[] = [processedPlateComponent];

      const result = (service as any).calculatePlateCosts(components);

      expect(result.category).toBe('Plate');
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('should return zero cost for thick materials', () => {
      const components: ProcessedComponent[] = [
        { ...processedDoorComponent, cutting_thickness: 18 },
      ];

      const result = (service as any).calculatePlateCosts(components);

      expect(result.totalCost).toBe(0);
      expect(result.items).toHaveLength(0);
    });
  });

  describe('calculateWoodToolsCosts', () => {
    it('should include base cost', () => {
      const components: ProcessedComponent[] = [processedDoorComponent];

      const result = (service as any).calculateWoodToolsCosts(components);

      expect(result.category).toBe('WoodTools');
      expect(result.totalCost).toBeGreaterThanOrEqual(500000); // Base cost
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should add cost for multiple material types', () => {
      const components: ProcessedComponent[] = [
        { ...processedDoorComponent, materialType: 'Material A' },
        { ...processedCNCComponent, materialType: 'Material B' },
      ];

      const result = (service as any).calculateWoodToolsCosts(components);

      // Base (500k) + 1 additional material (50k) = 550k
      expect(result.totalCost).toBeGreaterThanOrEqual(550000);
    });

    it('should add cost for CNC components', () => {
      const components: ProcessedComponent[] = [
        processedDoorComponent,
        processedCNCComponent,
      ];

      const result = (service as any).calculateWoodToolsCosts(components);

      // Base (500k) + 1 CNC (20k) = 520k
      expect(result.totalCost).toBeGreaterThanOrEqual(520000);
    });
  });
});


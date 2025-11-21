"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _materialsservice = require("./materials.service");
const _pricinglookupservice = require("../../common/utils/pricing-lookup.service");
const _testcomponentsfixture = require("../../test/fixtures/test-components.fixture");
describe('MaterialsService', ()=>{
    let service;
    let pricingLookupService;
    beforeEach(async ()=>{
        // Create mock pricing lookup service
        const mockPricingLookupService = {
            getMaterialByName: jest.fn(),
            getMaterialByCode: jest.fn(),
            getAllMaterials: jest.fn()
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _materialsservice.MaterialsService,
                {
                    provide: _pricinglookupservice.PricingLookupService,
                    useValue: mockPricingLookupService
                }
            ]
        }).compile();
        service = module.get(_materialsservice.MaterialsService);
        pricingLookupService = module.get(_pricinglookupservice.PricingLookupService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
    describe('calculateMaterialCosts', ()=>{
        it('should calculate costs for single material type', async ()=>{
            // Setup mock material data
            pricingLookupService.getMaterialByName.mockResolvedValue({
                code: 'MAT-1',
                description: 'ام دی اف 16 میل - سفید',
                unit: 'متر مربع',
                unitPrice: 22000000,
                category: 'Panel',
                persianNames: [
                    'ام دی اف'
                ],
                isActive: true,
                id: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const components = [
                _testcomponentsfixture.processedDoorComponent
            ];
            const result = await service.calculateMaterialCosts(components);
            expect(result).toBeDefined();
            expect(result.category).toBe('Material');
            expect(result.totalCost).toBeGreaterThan(0);
            expect(result.totalArea).toBeCloseTo(0.48, 2);
            expect(result.items).toHaveLength(1);
            expect(result.items[0].description).toBe('ام دی اف 16 میل - سفید');
        });
        it('should calculate costs for multiple material types', async ()=>{
            // Setup different materials
            pricingLookupService.getMaterialByName.mockResolvedValueOnce({
                code: 'MAT-1',
                description: 'ام دی اف 16 میل - سفید',
                unit: 'متر مربع',
                unitPrice: 22000000,
                category: 'Panel',
                persianNames: [
                    'ام دی اف'
                ],
                isActive: true,
                id: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            }).mockResolvedValueOnce({
                code: 'MAT-4',
                description: 'پی وی سی 16 میل - سفید',
                unit: 'متر مربع',
                unitPrice: 17000000,
                category: 'Panel',
                persianNames: [
                    'پی وی سی'
                ],
                isActive: true,
                id: '4',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const components = [
                {
                    ..._testcomponentsfixture.processedDoorComponent,
                    materialType: 'ام دی اف'
                },
                {
                    ..._testcomponentsfixture.processedCNCComponent,
                    materialType: 'پی وی سی'
                }
            ];
            const result = await service.calculateMaterialCosts(components);
            expect(result.items.length).toBeGreaterThanOrEqual(1);
            expect(result.totalCost).toBeGreaterThan(0);
        });
        it('should handle unknown materials with default pricing', async ()=>{
            // Mock material not found, then return default
            pricingLookupService.getMaterialByName.mockResolvedValue(undefined);
            pricingLookupService.getMaterialByCode.mockResolvedValue(undefined);
            pricingLookupService.getAllMaterials.mockResolvedValue([
                {
                    code: 'MAT-1',
                    description: 'ام دی اف 16 میل - سفید',
                    unit: 'متر مربع',
                    unitPrice: 22000000,
                    category: 'Panel',
                    persianNames: [
                        'ام دی اف'
                    ],
                    isActive: true,
                    id: '1',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            const components = [
                {
                    ..._testcomponentsfixture.processedDoorComponent,
                    materialType: 'Unknown Material XYZ'
                }
            ];
            const result = await service.calculateMaterialCosts(components);
            expect(result.totalCost).toBeGreaterThan(0);
            expect(result.items).toHaveLength(1);
            // Should use default material
            expect(pricingLookupService.getAllMaterials).toHaveBeenCalled();
        });
        it('should group components by material type', async ()=>{
            pricingLookupService.getMaterialByName.mockResolvedValue({
                code: 'MAT-1',
                description: 'ام دی اف 16 میل - سفید',
                unit: 'متر مربع',
                unitPrice: 22000000,
                category: 'Panel',
                persianNames: [
                    'ام دی اف'
                ],
                isActive: true,
                id: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            // Multiple components with same material
            const components = [
                {
                    ..._testcomponentsfixture.processedDoorComponent,
                    sumArea: 0.48
                },
                {
                    ..._testcomponentsfixture.processedCNCComponent,
                    materialType: 'ام دی اف',
                    sumArea: 0.48
                }
            ];
            const result = await service.calculateMaterialCosts(components);
            // Should have 1 material group with combined area
            expect(result.items).toHaveLength(1);
            expect(result.totalArea).toBeCloseTo(0.96, 2);
        });
    });
    describe('applyWastePercentage', ()=>{
        it('should apply waste percentage correctly', ()=>{
            const baseCosts = {
                category: 'Material',
                totalCost: 1000000,
                totalArea: 1.0,
                totalQuantity: 10,
                items: [
                    {
                        cost: 1000000,
                        description: 'Test Material',
                        unit: 'm²',
                        quantity: 1.0,
                        code: 'TEST'
                    }
                ]
            };
            const result = service.applyWastePercentage(baseCosts, 0.15);
            expect(result.totalCost).toBe(1150000); // 1M × 1.15
            expect(result.totalArea).toBeCloseTo(1.15, 2);
            expect(result.items[0].cost).toBe(1150000);
            expect(result.items[0].quantity).toBeCloseTo(1.15, 2);
        });
        it('should handle zero waste percentage', ()=>{
            const baseCosts = {
                category: 'Material',
                totalCost: 1000000,
                totalArea: 1.0,
                totalQuantity: 10,
                items: []
            };
            const result = service.applyWastePercentage(baseCosts, 0);
            expect(result.totalCost).toBe(1000000);
            expect(result.totalArea).toBe(1.0);
        });
    });
    describe('getMaterialSummary', ()=>{
        it('should return correct summary statistics', ()=>{
            const materialCosts = {
                category: 'Material',
                totalCost: 5000000,
                totalArea: 2.5,
                totalQuantity: 10,
                items: [
                    {
                        cost: 3000000,
                        description: 'Material A',
                        unit: 'm²',
                        quantity: 1.5,
                        code: 'MAT-A'
                    },
                    {
                        cost: 2000000,
                        description: 'Material B',
                        unit: 'm²',
                        quantity: 1.0,
                        code: 'MAT-B'
                    }
                ]
            };
            const summary = service.getMaterialSummary(materialCosts);
            expect(summary.totalMaterials).toBe(2);
            expect(summary.averageCostPerItem).toBe(2500000);
            expect(summary.totalArea).toBe(2.5);
            expect(summary.mostExpensiveMaterial).toBe('Material A');
        });
    });
    describe('validateMaterialCosts', ()=>{
        it('should validate costs without warnings', ()=>{
            const materialCosts = {
                category: 'Material',
                totalCost: 5000000,
                totalArea: 2.5,
                totalQuantity: 10,
                items: [
                    {
                        cost: 5000000,
                        description: 'Material A',
                        unit: 'm²',
                        quantity: 2.5,
                        code: 'MAT-A'
                    }
                ]
            };
            const validation = service.validateMaterialCosts(materialCosts);
            expect(validation.isValid).toBe(true);
            expect(validation.warnings).toHaveLength(0);
        });
        it('should detect zero total cost', ()=>{
            const materialCosts = {
                category: 'Material',
                totalCost: 0,
                totalArea: 2.5,
                totalQuantity: 10,
                items: []
            };
            const validation = service.validateMaterialCosts(materialCosts);
            expect(validation.isValid).toBe(false);
            expect(validation.warnings.length).toBeGreaterThan(0);
            expect(validation.warnings[0]).toContain('zero or negative');
        });
        it('should detect items with zero cost', ()=>{
            const materialCosts = {
                category: 'Material',
                totalCost: 5000000,
                totalArea: 2.5,
                totalQuantity: 10,
                items: [
                    {
                        cost: 0,
                        description: 'Material A',
                        unit: 'm²',
                        quantity: 2.5,
                        code: 'MAT-A'
                    }
                ]
            };
            const validation = service.validateMaterialCosts(materialCosts);
            expect(validation.isValid).toBe(false);
            expect(validation.warnings.length).toBeGreaterThan(0);
        });
    });
});

//# sourceMappingURL=materials.service.spec.js.map
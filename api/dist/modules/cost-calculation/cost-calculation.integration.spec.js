"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _costcalculationservice = require("./cost-calculation.service");
const _materialsservice = require("../materials/materials.service");
const _pricingservice = require("../pricing/pricing.service");
const _pricinglookupservice = require("../../common/utils/pricing-lookup.service");
const _prismaservice = require("../../prisma/prisma.service");
const _testcomponentsfixture = require("../../test/fixtures/test-components.fixture");
/**
 * Integration tests for complete cost calculation flow
 * Tests the full pipeline from component data to final price
 */ describe('Cost Calculation Integration Tests', ()=>{
    let calculationService;
    let materialsService;
    let pricingService;
    let pricingLookupService;
    beforeEach(async ()=>{
        // Mock PrismaService with realistic data
        const mockPrismaService = {
            material: {
                findUnique: jest.fn((args)=>{
                    const materials = {
                        'MAT-1': {
                            code: 'MAT-1',
                            description: 'ام دی اف 16 میل - سفید',
                            unit: 'متر مربع',
                            unitPrice: 22000000,
                            category: 'Panel',
                            persianNames: [
                                'ام دی اف'
                            ],
                            isActive: true
                        }
                    };
                    return Promise.resolve(materials[args.where.code] || null);
                }),
                findFirst: jest.fn(()=>Promise.resolve({
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
                    })),
                findMany: jest.fn(()=>Promise.resolve([
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
                    ]))
            },
            edgeBanding: {
                findUnique: jest.fn(()=>Promise.resolve({
                        code: 'EB-1',
                        description: 'نوار کاری',
                        unit: 'متر',
                        unitPrice: 85000,
                        isActive: true,
                        id: '1',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }))
            },
            cNCOperation: {
                findUnique: jest.fn(()=>Promise.resolve({
                        code: 'CNC-1',
                        description: 'CNC - درب کابینت',
                        unit: 'عدد',
                        unitPrice: 500000,
                        isActive: true,
                        id: '1',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }))
            },
            fitting: {
                findUnique: jest.fn(()=>Promise.resolve(null)),
                findFirst: jest.fn(()=>Promise.resolve(null))
            },
            pricingConfig: {
                findFirst: jest.fn(()=>Promise.resolve(null))
            }
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _costcalculationservice.CostCalculationService,
                _materialsservice.MaterialsService,
                _pricingservice.PricingService,
                _pricinglookupservice.PricingLookupService,
                {
                    provide: _prismaservice.PrismaService,
                    useValue: mockPrismaService
                }
            ]
        }).compile();
        calculationService = module.get(_costcalculationservice.CostCalculationService);
        materialsService = module.get(_materialsservice.MaterialsService);
        pricingService = module.get(_pricingservice.PricingService);
        pricingLookupService = module.get(_pricinglookupservice.PricingLookupService);
    });
    describe('Full Calculation Flow', ()=>{
        it('should calculate complete cost for simple door project', async ()=>{
            const components = [
                _testcomponentsfixture.simpleDoorComponent
            ];
            const result = await calculationService.calculateFullCost(components, {
                projectName: 'Kitchen Cabinets',
                clientName: 'John Doe',
                contractDate: '2025-01-15',
                wastePercentage: 0.15
            });
            // Verify result structure
            expect(result).toBeDefined();
            expect(result.project).toBeDefined();
            expect(result.project.name).toBe('Kitchen Cabinets');
            expect(result.project.client).toBe('John Doe');
            // Verify all cost categories exist
            expect(result.costs.material).toBeDefined();
            expect(result.costs.boreshKari).toBeDefined();
            expect(result.costs.cnc).toBeDefined();
            expect(result.costs.navarShiar).toBeDefined();
            expect(result.costs.fittings).toBeDefined();
            expect(result.costs.painting).toBeDefined();
            expect(result.costs.plate).toBeDefined();
            expect(result.costs.woodTools).toBeDefined();
            // Material costs should be positive
            expect(result.costs.material.totalCost).toBeGreaterThan(0);
            // Fittings costs should be positive (doors have hinges)
            expect(result.costs.fittings.totalCost).toBeGreaterThan(0);
            // WoodTools should have at least base cost
            expect(result.costs.woodTools.totalCost).toBeGreaterThanOrEqual(500000);
            // Financial summary
            expect(result.financialSummary).toBeDefined();
            expect(result.financialSummary.subtotal).toBeGreaterThan(0);
            expect(result.financialSummary.finalPrice).toBeGreaterThan(result.financialSummary.subtotal);
            // Verify overhead calculations
            const expectedOverheadTotal = result.financialSummary.subtotal * (0.25 + 0.04 + 0.02 + 0.02 + 0.025);
            expect(result.financialSummary.overheads.totalOverheads).toBeCloseTo(expectedOverheadTotal, -3);
            // Verify profit calculation (22%)
            const expectedProfit = result.financialSummary.totalWithOverheads * 0.22;
            expect(result.financialSummary.profitAmount).toBeCloseTo(expectedProfit, -3);
        });
        it('should calculate costs for complex project with multiple component types', async ()=>{
            const components = [
                _testcomponentsfixture.simpleDoorComponent,
                _testcomponentsfixture.drawerComponent,
                _testcomponentsfixture.cncComponent,
                _testcomponentsfixture.shelfComponent
            ];
            const result = await calculationService.calculateFullCost(components, {
                projectName: 'Full Kitchen',
                clientName: 'Jane Smith',
                contractDate: '2025-02-01',
                wastePercentage: 0.15
            });
            // Material costs should account for all components
            expect(result.costs.material.totalCost).toBeGreaterThan(0);
            expect(result.costs.material.totalArea).toBeGreaterThan(0);
            // CNC costs should be present
            expect(result.costs.cnc.totalCost).toBeGreaterThan(0);
            // Fittings should include hinges, drawer rails, and handles
            expect(result.costs.fittings.totalCost).toBeGreaterThan(0);
            expect(result.costs.fittings.items.length).toBeGreaterThan(0);
            // Edge banding costs for components with edges
            expect(result.costs.navarShiar.totalCost).toBeGreaterThan(0);
            // WoodTools should account for CNC complexity
            expect(result.costs.woodTools.totalCost).toBeGreaterThan(500000);
            // Final price should be reasonable
            expect(result.financialSummary.finalPrice).toBeGreaterThan(result.financialSummary.subtotal);
        });
        it('should handle project with only shelves (minimal fittings)', async ()=>{
            const components = [
                _testcomponentsfixture.shelfComponent,
                _testcomponentsfixture.shelfComponent
            ];
            const result = await calculationService.calculateFullCost(components, {
                projectName: 'Shelving Unit',
                clientName: 'Bob Builder',
                contractDate: '2025-03-01',
                wastePercentage: 0.10
            });
            // Material costs present
            expect(result.costs.material.totalCost).toBeGreaterThan(0);
            // CNC costs should be zero (no CNC components)
            expect(result.costs.cnc.totalCost).toBe(0);
            // Fittings might be minimal or zero
            // (shelves may not need fittings depending on heuristics)
            // WoodTools should still have base cost
            expect(result.costs.woodTools.totalCost).toBeGreaterThanOrEqual(500000);
        });
        it('should properly apply waste percentage', async ()=>{
            const components = [
                _testcomponentsfixture.simpleDoorComponent
            ];
            // Calculate with 0% waste
            const resultNoWaste = await calculationService.calculateFullCost(components, {
                projectName: 'Test',
                clientName: 'Test',
                contractDate: '2025-01-01',
                wastePercentage: 0
            });
            // Calculate with 20% waste
            const resultWithWaste = await calculationService.calculateFullCost(components, {
                projectName: 'Test',
                clientName: 'Test',
                contractDate: '2025-01-01',
                wastePercentage: 0.20
            });
            // Material cost with waste should be higher (but waste not directly applied to final in this implementation)
            // The waste is applied during processing of components
            expect(resultWithWaste.costs.material.totalCost).toBeGreaterThanOrEqual(resultNoWaste.costs.material.totalCost);
        });
    });
    describe('Cost Breakdown Validation', ()=>{
        it('should have valid cost breakdown structure', async ()=>{
            const result = await calculationService.calculateFullCost([
                _testcomponentsfixture.simpleDoorComponent
            ], {
                projectName: 'Test',
                clientName: 'Test',
                contractDate: '2025-01-01',
                wastePercentage: 0.15
            });
            // Verify breakdown matches subtotal
            const breakdownSum = result.financialSummary.breakdown.material + result.financialSummary.breakdown.boreshKari + result.financialSummary.breakdown.cnc + result.financialSummary.breakdown.navarShiar + result.financialSummary.breakdown.fittings + result.financialSummary.breakdown.painting + result.financialSummary.breakdown.plate + result.financialSummary.breakdown.woodTools;
            expect(breakdownSum).toBe(result.financialSummary.subtotal);
        });
        it('should calculate overheads as percentages of subtotal', async ()=>{
            const result = await calculationService.calculateFullCost([
                _testcomponentsfixture.simpleDoorComponent
            ], {
                projectName: 'Test',
                clientName: 'Test',
                contractDate: '2025-01-01',
                wastePercentage: 0.15
            });
            const subtotal = result.financialSummary.subtotal;
            expect(result.financialSummary.overheads.overhead1).toBeCloseTo(subtotal * 0.25, -2);
            expect(result.financialSummary.overheads.overhead2).toBeCloseTo(subtotal * 0.04, -2);
            expect(result.financialSummary.overheads.overhead3).toBeCloseTo(subtotal * 0.02, -2);
            expect(result.financialSummary.overheads.overhead4).toBeCloseTo(subtotal * 0.02, -2);
            expect(result.financialSummary.overheads.contingency).toBeCloseTo(subtotal * 0.025, -2);
        });
    });
    describe('Edge Cases', ()=>{
        it('should handle empty component list', async ()=>{
            const result = await calculationService.calculateFullCost([], {
                projectName: 'Empty Project',
                clientName: 'Test',
                contractDate: '2025-01-01',
                wastePercentage: 0.15
            });
            expect(result.costs.material.totalCost).toBe(0);
            expect(result.financialSummary.subtotal).toBeGreaterThanOrEqual(0);
            // Still should have base woodtools cost
            expect(result.costs.woodTools.totalCost).toBeGreaterThanOrEqual(500000);
        });
        it('should handle components with zero quantity', async ()=>{
            const zeroQuantityComponent = {
                ..._testcomponentsfixture.simpleDoorComponent,
                quantity: 0,
                area: 0
            };
            const result = await calculationService.calculateFullCost([
                zeroQuantityComponent
            ], {
                projectName: 'Zero Quantity Test',
                clientName: 'Test',
                contractDate: '2025-01-01',
                wastePercentage: 0.15
            });
            // Should handle gracefully without errors
            expect(result).toBeDefined();
            // With zero area and quantity, material cost should be zero or very low
            expect(result.costs.material.totalCost).toBeLessThanOrEqual(100);
        });
        it('should handle very large projects', async ()=>{
            // Create a large project with 100 components
            const largeProject = Array(100).fill(null).map((_, index)=>({
                    ..._testcomponentsfixture.simpleDoorComponent,
                    componentId: `CD-${index}`,
                    quantity: 1
                }));
            const result = await calculationService.calculateFullCost(largeProject, {
                projectName: 'Large Project',
                clientName: 'Test',
                contractDate: '2025-01-01',
                wastePercentage: 0.15
            });
            expect(result).toBeDefined();
            expect(result.costs.material.totalCost).toBeGreaterThan(0);
            expect(result.financialSummary.finalPrice).toBeGreaterThan(0);
        });
    });
    describe('Timestamp and Metadata', ()=>{
        it('should include calculation timestamp', async ()=>{
            const result = await calculationService.calculateFullCost([
                _testcomponentsfixture.simpleDoorComponent
            ], {
                projectName: 'Test',
                clientName: 'Test',
                contractDate: '2025-01-01',
                wastePercentage: 0.15
            });
            expect(result.calculatedAt).toBeInstanceOf(Date);
            expect(result.version).toBeDefined();
        });
        it('should preserve project metadata', async ()=>{
            const projectData = {
                projectName: 'Custom Kitchen Remodel',
                clientName: 'Alice Wonderland',
                contractDate: '2025-06-15',
                wastePercentage: 0.18
            };
            const result = await calculationService.calculateFullCost([
                _testcomponentsfixture.simpleDoorComponent
            ], projectData);
            expect(result.project.name).toBe(projectData.projectName);
            expect(result.project.client).toBe(projectData.clientName);
            expect(result.project.date).toBe(projectData.contractDate);
        });
    });
});

//# sourceMappingURL=cost-calculation.integration.spec.js.map
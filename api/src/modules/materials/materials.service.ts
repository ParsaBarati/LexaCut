import { Injectable } from '@nestjs/common';
import {
  ProcessedComponent,
  MaterialCategory,
  CostItem,
} from '../../common/interfaces';
import { PricingLookupService } from '../../common/utils/pricing-lookup.service';
import { sum, round } from '../../common/utils/excel-functions';

/**
 * Material Service
 * Implements calculations from "Material" sheet
 * Processes material costs from component data using Pivot Table logic
 */
@Injectable()
export class MaterialsService {
  constructor(private readonly pricingLookup: PricingLookupService) {}

  /**
   * Calculate material costs from processed components
   * Replicates VBA Material() macro and Material sheet calculations
   * 
   * Excel flow:
   * 1. Creates Pivot Table from "All" sheet (W:X range)
   * 2. Groups by Material, sums SumArea
   * 3. Copies pivot results to Material sheet (AA4:AB27 → I7:H7)
   * 4. VLOOKUPs material descriptions and units (W:Z range)
   * 5. Calculates costs and sums to A31
   * 
   * @param components - Processed components with material data
   * @returns MaterialCategory with calculated costs
   */
  async calculateMaterialCosts(components: ProcessedComponent[]): Promise<MaterialCategory> {
    console.log(`MaterialsService: Calculating costs for ${components.length} components`);
    
    // Step 1: Group components by material type (Pivot Table equivalent)
    // Excel: Pivot Table on All sheet W:X, grouped by Material
    const materialGroups = this.groupByMaterial(components);
    
    console.log(`MaterialsService: Found ${Object.keys(materialGroups).length} material groups:`, Object.keys(materialGroups));

    // Step 2: Calculate cost for each material group
    const items: CostItem[] = [];
    let totalCost = 0;
    let totalArea = 0;
    let totalQuantity = 0;

    for (const [materialType, groupData] of Object.entries(materialGroups)) {
      console.log(`MaterialsService: Processing material "${materialType}" with area ${groupData.totalArea}m²`);
      // VLOOKUP material info from pricing tables (W:Z range)
      // Try by name first (handles Persian names), then by code
      const materialInfo = await this.pricingLookup.getMaterialByName(materialType) || 
                          await this.pricingLookup.getMaterialByCode(materialType);
      
      if (!materialInfo) {
        // If material not found in pricing table, use default pricing
        console.warn(`Material not found in pricing table: ${materialType}, using default`);
        // Use default MDF pricing as fallback
        const allMaterials = await this.pricingLookup.getAllMaterials();
        const defaultMaterial = allMaterials[0];
        if (!defaultMaterial) {
          console.error('No materials in pricing table!');
          continue;
        }
        // Continue with default material
        const cost = round(groupData.totalArea * (defaultMaterial.unitPrice || 125000), 0);
        items.push({
          cost,
          description: materialType || defaultMaterial.description,
          unit: defaultMaterial.unit || 'm²',
          quantity: groupData.totalArea,
          code: materialType,
        });
        totalCost += cost;
        totalArea += groupData.totalArea;
        totalQuantity += groupData.count;
        continue;
      }

      // Calculate total area for this material (SumArea from pivot)
      const groupArea = groupData.totalArea;
      
      // Calculate cost = area * unit price
      // Excel: Material sheet, Column A (cost calculations)
      const cost = round(groupArea * (materialInfo.unitPrice || 0), 0);

      items.push({
        cost,                                   // Column A
        description: materialInfo.description,  // Column B (from VLOOKUP)
        unit: materialInfo.unit,                // Column C (from VLOOKUP)
        quantity: groupArea,                    // Column D (area in m²)
        code: materialType,                     // Column I (material code)
      });

      totalCost += cost;
      totalArea += groupArea;
      totalQuantity += groupData.count;
    }

    // Sum totals (Material!A31, C31, E31, G31)
    return {
      category: 'Material',
      totalCost: round(totalCost, 0),        // Material!A31 = SUM(A7:A30)
      totalArea: round(totalArea, 2),        // Material!C31 = SUM(C7:C30) if present
      totalQuantity: round(totalQuantity, 0), // Material!E31 = SUM(E7:E30) if present
      items,
    };
  }

  /**
   * Group components by material type and sum areas
   * Replicates Excel Pivot Table: PivotFields("Material").Orientation = xlRowField
   * 
   * @param components - Array of processed components
   * @returns Map of material type to aggregated data
   */
  private groupByMaterial(components: ProcessedComponent[]): Record<string, {
    totalArea: number;
    count: number;
    components: ProcessedComponent[];
  }> {
    const groups: Record<string, {
      totalArea: number;
      count: number;
      components: ProcessedComponent[];
    }> = {};

    for (const component of components) {
      const materialKey = component.materialType;
      
      if (!groups[materialKey]) {
        groups[materialKey] = {
          totalArea: 0,
          count: 0,
          components: [],
        };
      }

      // Sum area (SumArea field in pivot table)
      // Excel: .PivotFields("SumArea").Orientation = xlDataField
      groups[materialKey].totalArea += component.sumArea || component.area;
      groups[materialKey].count += 1;
      groups[materialKey].components.push(component);
    }

    return groups;
  }

  /**
   * Calculate material requirements with waste percentage
   * Applies waste multiplier from Data!E2
   * 
   * @param materialCosts - Base material costs
   * @param wastePercentage - Waste percentage (e.g., 0.15 for 15%)
   * @returns Adjusted material costs with waste included
   */
  applyWastePercentage(
    materialCosts: MaterialCategory,
    wastePercentage: number
  ): MaterialCategory {
    const wasteMultiplier = 1 + wastePercentage;
    
    return {
      ...materialCosts,
      totalCost: round(materialCosts.totalCost * wasteMultiplier, 0),
      totalArea: materialCosts.totalArea 
        ? round(materialCosts.totalArea * wasteMultiplier, 2)
        : undefined,
      items: materialCosts.items.map(item => ({
        ...item,
        cost: round(item.cost * wasteMultiplier, 0),
        quantity: round(item.quantity * wasteMultiplier, 2),
      })),
    };
  }

  /**
   * Get material summary statistics
   * Useful for reporting and validation
   */
  getMaterialSummary(materialCosts: MaterialCategory): {
    totalMaterials: number;
    averageCostPerItem: number;
    totalArea: number;
    mostExpensiveMaterial: string;
  } {
    const items = materialCosts.items;
    const totalMaterials = items.length;
    const averageCostPerItem = totalMaterials > 0 
      ? materialCosts.totalCost / totalMaterials 
      : 0;
    
    const mostExpensive = items.reduce((max, item) => 
      item.cost > max.cost ? item : max, 
      items[0] || { cost: 0, description: '' }
    );

    return {
      totalMaterials,
      averageCostPerItem: round(averageCostPerItem, 0),
      totalArea: materialCosts.totalArea || 0,
      mostExpensiveMaterial: mostExpensive.description,
    };
  }

  /**
   * Validate material costs against expected ranges
   * Helps catch calculation errors
   */
  validateMaterialCosts(materialCosts: MaterialCategory): {
    isValid: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Check for zero or negative costs
    if (materialCosts.totalCost <= 0) {
      warnings.push('Total material cost is zero or negative');
    }

    // Check for items with zero cost
    materialCosts.items.forEach((item, index) => {
      if (item.cost <= 0) {
        warnings.push(`Item ${index + 1} (${item.description}) has zero or negative cost`);
      }
      
      if (item.quantity <= 0) {
        warnings.push(`Item ${index + 1} (${item.description}) has zero or negative quantity`);
      }
    });

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }
}


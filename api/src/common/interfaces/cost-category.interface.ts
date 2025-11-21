/**
 * Base interface for all cost categories
 * Each category sheet (Material, BoreshKari, CNC, etc.) follows similar pattern
 */
export interface CostCategory {
  /** Category name/identifier */
  category: string;
  
  /** Total cost for this category (sum of rows 7-30) */
  totalCost: number;
  
  /** Line items in this category */
  items: CostItem[];
}

/**
 * Individual cost line item (rows 7-30 in each sheet)
 */
export interface CostItem {
  /** Column A - Calculated cost or quantity-based value */
  cost: number;
  
  /** Column B - Description/Name from VLOOKUP */
  description: string;
  
  /** Column C - Unit of measurement */
  unit?: string;
  
  /** Column D - Quantity/Count */
  quantity: number;
  
  /** Column E - Additional identifier */
  additionalInfo?: string;
  
  /** Column F/I - Material code or reference for lookup */
  code?: string;
}

/**
 * Material category specific data
 * From "Material" sheet
 */
export interface MaterialCategory extends CostCategory {
  category: 'Material';
  
  /** Sum from Material!A31 */
  totalCost: number;
  
  /** Sum from Material!C31 if applicable */
  totalArea?: number;
  
  /** Sum from Material!E31 if applicable */
  totalQuantity?: number;
  
  /** Sum from Material!G31 if applicable */
  totalLength?: number;
}

/**
 * BoreshKari (Cutting) category
 * From "BoreshKari" sheet
 */
export interface BoreshKariCategory extends CostCategory {
  category: 'BoreshKari';
  
  /** Calculated from Material sheet data with VLOOKUPs */
  items: CostItem[];
  
  /** Total from BoreshKari!A31 */
  totalCost: number;
}

/**
 * CNC machining category
 * From "CNC" sheet
 */
export interface CNCCategory extends CostCategory {
  category: 'CNC';
  
  /** Items with CNC operations */
  items: CostItem[];
  
  /** Total from CNC!A31 */
  totalCost: number;
}

/**
 * Edge banding category (NavarShiarFarsi)
 * From "NavarShiarFarsi" sheet
 */
export interface NavarShiarCategory extends CostCategory {
  category: 'NavarShiar';
  
  /** Total from NavarShiarFarsi!A31 */
  totalCost: number;
}

/**
 * Fittings/Hardware category
 * From "Fittings" sheet - uses Pivot Table from FittingsData
 */
export interface FittingsCategory extends CostCategory {
  category: 'Fittings';
  
  /** Aggregated from Pivot Table */
  items: CostItem[];
  
  /** Total from Fittings!A31 */
  totalCost: number;
}

/**
 * Painting/Finishing category
 * From "Painting" sheet
 */
export interface PaintingCategory extends CostCategory {
  category: 'Painting';
  
  /** Items for painting operations */
  items: CostItem[];
  
  /** Total from Painting!A17 (rows 7-16) */
  totalCost1?: number;
  
  /** Total from Painting!A31 (rows 21-30) */
  totalCost2?: number;
  
  /** Combined total */
  totalCost: number;
}

/**
 * Plate/Sheet materials category
 * From "Plate" sheet
 */
export interface PlateCategory extends CostCategory {
  category: 'Plate';
  
  /** Total from Plate!A31 */
  totalCost: number;
}

/**
 * Wood tools category
 * From "WoodTools" sheet
 */
export interface WoodToolsCategory extends CostCategory {
  category: 'WoodTools';
  
  /** Total from WoodTools!A28 */
  totalCost: number;
}

/**
 * Complete cost breakdown for all categories
 */
export interface CostBreakdown {
  material: MaterialCategory;
  boreshKari: BoreshKariCategory;
  cnc: CNCCategory;
  navarShiar: NavarShiarCategory;
  fittings: FittingsCategory;
  painting: PaintingCategory;
  plate: PlateCategory;
  woodTools: WoodToolsCategory;
}


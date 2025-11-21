/**
 * Raw component data from CSV/All sheet
 * Maps to columns A-L in the "All" sheet
 */
export interface ComponentData {
  /** Column A - Component name/description */
  name: string;
  
  /** Column B - Component ID or secondary description */
  componentId: string;
  
  /** Column C - Quantity */
  quantity: number;
  
  /** Column D - Edge/Surface property 1 */
  edge1?: string;
  
  /** Column E - Edge/Surface property 2 */
  edge2?: string;
  
  /** Column F - Edge/Surface property 3 */
  edge3?: string;
  
  /** Column G - Edge/Surface property 4 */
  edge4?: string;
  
  /** Column H - Material type */
  materialType: string;
  
  /** Column I - Instance type/name (may contain "CNC-" prefix) */
  instanceType: string;
  
  /** Column J - Length (in mm or project units) */
  length: number;
  
  /** Column K - Width (in mm or project units) */
  width: number;
  
  /** Column L - Area (m² typically shown with "m²" suffix) */
  area: number;
}

/**
 * Processed component with calculated fields
 * After VBA macro processing (columns W through BC+)
 */
export interface ProcessedComponent extends ComponentData {
  /** Calculated: Column X - SumArea (Area * Quantity) */
  sumArea: number;
  
  /** Calculated: Section 1 (Column X = 24) - Quantity * Area */
  section1Value: number;
  
  /** Calculated: BA - (Length * Quantity) / 100 */
  lengthQuantity: number;
  
  /** Calculated: BB - (Length * Width * Quantity) * (1 + wastePercentage) / 10000 */
  areaWithWaste: number;
  
  /** Calculated: BC - ((Length * Width * Quantity) * 2) * (1 + wastePercentage) / 10000 */
  doubleAreaWithWaste: number;
  
  /** Color/finish from VLOOKUP (Data!L:M) */
  color?: string;
  
  /** Cleaned instance type (CNC- prefix removed, trimmed) */
  cleanInstanceType: string;
}


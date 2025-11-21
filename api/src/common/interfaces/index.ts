import { CostBreakdown } from './cost-category.interface';

/**
 * Lookup table entry for pricing
 * Replaces Excel VLOOKUP tables (columns W:Z, W:Y, etc.)
 */
export interface PricingLookup {
  /** Code/ID for lookup (first column in VLOOKUP range) */
  code: string;
  
  /** Description (second column) */
  description: string;
  
  /** Unit of measurement (third column if present) */
  unit?: string;
  
  /** Price per unit (if applicable) */
  unitPrice?: number;
  
  /** Additional data columns */
  additionalData?: Record<string, any>;
}

/**
 * Fittings database entry
 * From FittingsData sheet
 */
export interface FittingItem {
  /** Column A - Fitting code/ID */
  code: string;
  
  /** Column C - Fitting name/description */
  name: string;
  
  /** Column D - Quantity per fitting */
  qtyPerFitting: number;
  
  /** Column E - Project quantity (from VLOOKUP) */
  projectQty?: number;
  
  /** Column F - Total quantity (qtyPerFitting * projectQty) */
  totalQty?: number;
}

/**
 * Contract document data
 * From "قرارداد" (Contract) sheet
 */
export interface ContractData {
  /** Project name from Plate!A1 */
  projectName: string;
  
  /** Client name from W2 (Data!C2) */
  clientName: string;
  
  /** Final price from 'روکش مالی'!A33 */
  finalPrice: number;
  
  /** Contract date */
  contractDate: string;
  
  /** Custom contract fields (W3, W4, W5, etc.) */
  customFields: Record<string, string>;
  
  /** Complete cost breakdown for reference */
  costBreakdown?: CostBreakdown;
}

/**
 * Index for all interfaces
 */
export * from './project-data.interface';
export * from './component.interface';
export * from './cost-category.interface';
export * from './financial.interface';


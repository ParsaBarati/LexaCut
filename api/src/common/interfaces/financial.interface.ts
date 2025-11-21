import { CostBreakdown } from './cost-category.interface';

/**
 * Financial summary with overhead calculations
 * Maps to "روکش مالی" (Financial Summary) sheet
 */
export interface FinancialSummary {
  /** Base costs from all categories (SUM of A7:A26) */
  subtotal: number;
  
  /** Breakdown by category */
  breakdown: {
    /** Material!A31 → روکش مالی!A7 */
    material: number;
    
    /** BoreshKari!A31 → روکش مالی!A8 */
    boreshKari: number;
    
    /** NavarShiarFarsi!A31 → روکش مالی!A9 */
    navarShiar: number;
    
    /** CNC!A31 → روکش مالی!A10 */
    cnc: number;
    
    /** Fittings!A31 → روکش مالی!A11 */
    fittings: number;
    
    /** Painting!A31 → روکش مالی!A12 */
    painting: number;
    
    /** WoodTools!A28 → روکش مالی!A13 */
    woodTools: number;
    
    /** Plate!A31 → روکش مالی!A14 */
    plate: number;
  };
  
  /** Overhead calculations */
  overheads: {
    /** روکش مالی!A27 = SUM(A7:A26) * 0.25 (25% overhead) */
    overhead1: number;
    
    /** روکش مالی!A28 = SUM(A7:A26) * 0.04 (4% administrative) */
    overhead2: number;
    
    /** روکش مالی!A29 = SUM(A7:A26) * 0.02 (2% additional) */
    overhead3: number;
    
    /** روکش مالی!A30 = SUM(A7:A26) * 0.02 (2% additional) */
    overhead4: number;
    
    /** روکش مالی!A31 = SUM(A7:A26) * 0.025 (2.5% contingency) */
    contingency: number;
    
    /** Sum of all overheads */
    totalOverheads: number;
  };
  
  /** روکش مالی!A32 = subtotal + totalOverheads */
  totalWithOverheads: number;
  
  /** روکش مالی!A33 = A32 + (A32 * 0.22) - Final price with 22% profit */
  finalPrice: number;
  
  /** Profit amount (22% of totalWithOverheads) */
  profitAmount: number;
  
  /** Profit percentage (0.22 = 22%) */
  profitPercentage: number;
}

/**
 * Pricing configuration
 * Controls overhead percentages and profit margins
 */
export interface PricingConfig {
  /** General overhead percentage (default: 0.25 = 25%) */
  overhead1: number;
  
  /** Administrative overhead (default: 0.04 = 4%) */
  overhead2: number;
  
  /** Additional overhead 1 (default: 0.02 = 2%) */
  overhead3: number;
  
  /** Additional overhead 2 (default: 0.02 = 2%) */
  overhead4: number;
  
  /** Contingency percentage (default: 0.025 = 2.5%) */
  contingency: number;
  
  /** Profit margin percentage (default: 0.22 = 22%) */
  profitMargin: number;
}

/**
 * Complete calculation result
 * Everything needed to generate a contract
 */
export interface CalculationResult {
  /** Project metadata */
  project: {
    name: string;
    client: string;
    date: string;
  };
  
  /** All cost categories */
  costs: CostBreakdown;
  
  /** Financial summary with final price */
  financialSummary: FinancialSummary;
  
  /** Timestamp of calculation */
  calculatedAt: Date;
  
  /** Version/revision tracking */
  version?: string;
}


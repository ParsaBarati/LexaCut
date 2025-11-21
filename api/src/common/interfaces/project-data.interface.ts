/**
 * Project metadata from Data sheet
 */
export interface ProjectData {
  /** Project/Contract name - concatenation of Data!D3 and Data!C3 */
  projectName: string;
  
  /** Client name - from Data!D2 and Data!C2 */
  clientName: string;
  
  /** Date/reference from Data!C2 */
  contractDate: string;
  
  /** Custom field from Data!D12, Data!B12, Data!C12 */
  customFields?: Record<string, string>;
  
  /** Waste percentage multiplier (e.g., Data!E2 = 0.15 for 15% waste) */
  wastePercentage: number;
}


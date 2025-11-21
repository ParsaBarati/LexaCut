/**
 * LexaCut CSV Column Mapper
 * Explicit mapping between LexaCut export columns and backend ComponentData fields
 * This eliminates the need for fuzzy matching and ensures consistent parsing
 */

export const LEXACUT_COLUMN_MAP: Record<string, string> = {
  // Part identification
  'Number': 'componentId',
  'Name': 'name',
  'Count': 'quantity',
  
  // Dimensions (in mm from LexaCut)
  'Cutting length': 'length',
  'Cutting width': 'width',
  'Cutting thickness': 'thickness',
  
  // Material
  'Material name': 'materialType',
  
  // Instance/CNC information
  'Entity names': 'instanceType',
  
  // Edge banding
  'Edge ymin': 'edge1',
  'Edge ymax': 'edge2',
  'Edge xmin': 'edge3',
  'Edge xmax': 'edge4',
  
  // Area
  'Final area': 'area',
};

/**
 * Get backend field name from LexaCut column name
 * @param columnName - Column name from LexaCut CSV export
 * @returns Backend field name or null if not mapped
 */
export function getBackendFieldName(columnName: string): string | null {
  // Exact match first
  if (LEXACUT_COLUMN_MAP[columnName]) {
    return LEXACUT_COLUMN_MAP[columnName];
  }
  
  // Case-insensitive match
  const normalizedColumn = columnName.trim();
  for (const [key, value] of Object.entries(LEXACUT_COLUMN_MAP)) {
    if (key.toLowerCase() === normalizedColumn.toLowerCase()) {
      return value;
    }
  }
  
  return null;
}

/**
 * Get all expected LexaCut column names
 * @returns Array of expected column names
 */
export function getExpectedColumns(): string[] {
  return Object.keys(LEXACUT_COLUMN_MAP);
}

/**
 * Validate CSV headers against expected LexaCut columns
 * @param headers - Array of header names from CSV
 * @returns Validation result with missing and extra columns
 */
export function validateHeaders(headers: string[]): {
  isValid: boolean;
  missingColumns: string[];
  extraColumns: string[];
  foundColumns: string[];
} {
  const expectedColumns = getExpectedColumns();
  const normalizedHeaders = headers.map(h => h.trim());
  
  const foundColumns: string[] = [];
  const missingColumns: string[] = [];
  
  // Check for missing required columns
  for (const expected of expectedColumns) {
    const found = normalizedHeaders.find(
      h => h.toLowerCase() === expected.toLowerCase()
    );
    if (found) {
      foundColumns.push(expected);
    } else {
      // Only mark essential columns as missing
      const essentialColumns = ['Name', 'Count', 'Cutting length', 'Cutting width', 'Material name'];
      if (essentialColumns.includes(expected)) {
        missingColumns.push(expected);
      }
    }
  }
  
  // Find extra columns (informational only, not an error)
  const extraColumns = normalizedHeaders.filter(header => {
    return !expectedColumns.find(
      expected => expected.toLowerCase() === header.toLowerCase()
    );
  });
  
  return {
    isValid: missingColumns.length === 0,
    missingColumns,
    extraColumns,
    foundColumns,
  };
}


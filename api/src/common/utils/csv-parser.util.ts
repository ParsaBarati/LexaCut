import { Readable } from 'stream';
import csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { ComponentData } from '../interfaces';
import { getBackendFieldName, LEXACUT_COLUMN_MAP } from './lexacut-column-mapper';

/**
 * CSV Parser for "All" sheet data
 * Parses the CSV input that mimics Excel "All" sheet structure
 */

export interface CSVRow {
  [key: string]: string;
}

/**
 * Check if buffer is an Excel file (starts with PK\x03\x04 ZIP signature)
 */
function isExcelFile(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
}

/**
 * Parse Excel file into ComponentData array
 * @param buffer - Buffer containing Excel file data
 * @returns Array of ComponentData
 */
function parseExcelFile(buffer: Buffer): ComponentData[] {
  console.log('Detected Excel file, parsing with xlsx...');
  
  try {
    // Parse Excel workbook
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get first sheet (or look for "All" sheet)
    const sheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('all') || name.toLowerCase().includes('sheet')
    ) || workbook.SheetNames[0];
    
    console.log(`Reading sheet: ${sheetName}`);
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON (array of objects)
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as CSVRow[];
    
    console.log(`Excel parsing: Read ${rows.length} rows from sheet "${sheetName}"`);
    if (rows.length > 0) {
      console.log('First Excel row keys:', Object.keys(rows[0]));
      console.log('First Excel row:', rows[0]);
    }
    
    // Map rows to components
    const components = rows
      .map(mapRowToComponent)
      .filter(comp => {
        // Filter out completely empty rows
        const hasLength = comp.length > 0;
        const hasWidth = comp.width > 0;
        const hasQuantity = comp.quantity > 0;
        const hasArea = comp.area > 0;
        const hasMaterial = comp.materialType && comp.materialType.trim() !== '';
        const hasName = comp.name && comp.name.trim() !== '' && comp.name !== 'Component';
        const hasComponentId = comp.componentId && comp.componentId.trim() !== '';
        
        const isValid = hasLength || hasWidth || hasQuantity || hasArea || hasMaterial || hasName || hasComponentId;
        
        if (isValid) {
          console.log('Valid component:', {
            name: comp.name,
            material: comp.materialType,
            length: comp.length,
            width: comp.width,
            quantity: comp.quantity,
            area: comp.area,
          });
        }
        
        return isValid;
      });
    
    console.log(`Excel parsing: ${rows.length} rows read, ${components.length} valid components`);
    return components;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse CSV file/stream into ComponentData array
 * Supports both CSV and Excel (.xlsx) files
 * @param input - Readable stream or Buffer containing CSV or Excel data
 * @returns Promise resolving to array of ComponentData
 */
export async function parseCSV(input: Readable | Buffer): Promise<ComponentData[]> {
  // Convert to buffer if needed
  let buffer: Buffer;
  
  if (input instanceof Buffer) {
    buffer = input;
  } else {
    // Read stream into buffer
    const chunks: Buffer[] = [];
    for await (const chunk of input) {
      chunks.push(chunk);
    }
    buffer = Buffer.concat(chunks);
  }
  
  // Check if it's an Excel file
  if (isExcelFile(buffer)) {
    return parseExcelFile(buffer);
  }
  
  // Otherwise, parse as CSV
  console.log('Detected CSV file, parsing with csv-parser...');
  const stream = Readable.from(buffer);
  const rows: CSVRow[] = [];
  
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (row: CSVRow) => {
        // Log first row to see structure
        if (rows.length === 0) {
          console.log('First CSV row keys:', Object.keys(row));
          console.log('First CSV row:', row);
        }
        rows.push(row);
      })
      .on('end', () => {
        console.log(`CSV parsing: Read ${rows.length} rows from CSV`);
        try {
          const components = rows
            .map(mapRowToComponent)
            .filter(comp => {
              // Filter out completely empty rows
              const hasLength = comp.length > 0;
              const hasWidth = comp.width > 0;
              const hasQuantity = comp.quantity > 0;
              const hasArea = comp.area > 0;
              const hasMaterial = comp.materialType && comp.materialType.trim() !== '';
              const hasName = comp.name && comp.name.trim() !== '' && comp.name !== 'Component';
              const hasComponentId = comp.componentId && comp.componentId.trim() !== '';
              
              const isValid = hasLength || hasWidth || hasQuantity || hasArea || hasMaterial || hasName || hasComponentId;
              
              if (isValid) {
                console.log('Valid component:', {
                  name: comp.name,
                  material: comp.materialType,
                  length: comp.length,
                  width: comp.width,
                  quantity: comp.quantity,
                  area: comp.area,
                });
              }
              
              return isValid;
            });
          
          console.log(`CSV parsing: ${rows.length} rows read, ${components.length} valid components`);
          resolve(components);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

/**
 * Map CSV row to ComponentData interface
 * Uses explicit LexaCut column mapping first, then falls back to fuzzy matching for legacy formats
 * 
 * LexaCut Export Columns (optimized preset):
 * - Number → componentId
 * - Name → name
 * - Count → quantity
 * - Cutting length → length (in mm from LexaCut)
 * - Cutting width → width (in mm from LexaCut)
 * - Cutting thickness → thickness
 * - Material name → materialType
 * - Entity names → instanceType
 * - Edge ymin, ymax, xmin, xmax → edge1-4
 * - Final area → area (in m²)
 * 
 * Legacy CSV Columns (fallback):
 * - Length - raw (cm) → length (mm)
 * - Width - raw (cm) → width (mm)
 * - Designation → componentId
 * - Description → name
 */
function mapRowToComponent(row: CSVRow): ComponentData {
  // Debug: Log available keys
  const rowKeys = Object.keys(row);
  const firstLog = rowKeys.length > 0 && !rowKeys[0].includes('Length');
  
  if (firstLog) {
    console.log('CSV Row keys:', rowKeys);
  }
  
  /**
   * Get value using explicit LexaCut mapping first, then fallback to fuzzy matching
   */
  const getValueWithMapping = (lexacutColumn: string, legacyKeys?: string[]): string => {
    // 1. Try exact LexaCut column name match first
    if (row[lexacutColumn] !== undefined && row[lexacutColumn] !== null) {
      const value = String(row[lexacutColumn]).trim();
      if (value !== '') return value;
    }
    
    // 2. Try case-insensitive match for LexaCut column
    const found = rowKeys.find(rk => rk.toLowerCase() === lexacutColumn.toLowerCase());
    if (found && row[found] !== undefined && row[found] !== null) {
      const value = String(row[found]).trim();
      if (value !== '') return value;
    }
    
    // 3. Fallback to legacy keys (fuzzy matching)
    if (legacyKeys && legacyKeys.length > 0) {
      const allKeys = legacyKeys;
      
      // Try exact match
      for (const k of allKeys) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
          return String(row[k]).trim();
        }
      }
      
      // Try case-insensitive match
      for (const k of allKeys) {
        const legacyFound = rowKeys.find(rk => rk.toLowerCase() === k.toLowerCase());
        if (legacyFound && row[legacyFound] !== undefined && row[legacyFound] !== null) {
          const value = String(row[legacyFound]).trim();
          if (value !== '') return value;
        }
      }
      
      // Try partial match (for keys with spaces/dashes)
      for (const k of allKeys) {
        const normalizedK = k.toLowerCase().replace(/[\s_-]/g, '');
        const partialFound = rowKeys.find(rk => {
          const normalizedRk = rk.toLowerCase().replace(/[\s_-]/g, '');
          return normalizedRk === normalizedK || normalizedRk.includes(normalizedK);
        });
        if (partialFound && row[partialFound] !== undefined && row[partialFound] !== null) {
          const value = String(row[partialFound]).trim();
          if (value !== '') return value;
        }
      }
    }
    
    return '';
  };

  // Check if this is LexaCut optimized format or legacy format
  const isLexaCutFormat = rowKeys.some(k => k.toLowerCase() === 'cutting length');
  
  let lengthValue: number;
  let widthValue: number;
  let thicknessValue: number = 0;
  
  if (isLexaCutFormat) {
    // LexaCut format: dimensions already in mm
    lengthValue = parseNumber(getValueWithMapping('Cutting length'));
    widthValue = parseNumber(getValueWithMapping('Cutting width'));
    thicknessValue = parseNumber(getValueWithMapping('Cutting thickness'));
    
    if (firstLog) {
      console.log('Detected LexaCut optimized format (dimensions in mm)');
    }
  } else {
    // Legacy format: dimensions in cm, need to convert to mm
    const lengthCm = parseNumber(getValueWithMapping('Length - raw', ['Length - raw', 'Length-raw', 'length', 'Length']));
    const widthCm = parseNumber(getValueWithMapping('Width - raw', ['Width - raw', 'Width-raw', 'width', 'Width']));
    lengthValue = lengthCm * 10; // Convert cm to mm
    widthValue = widthCm * 10;   // Convert cm to mm
    
    if (firstLog) {
      console.log('Detected legacy format (dimensions in cm, converting to mm)');
    }
  }
  
  // Quantity/Count
  const quantity = parseNumber(getValueWithMapping('Count', ['Quantity', 'quantity', 'Qty']));
  
  // Area - parse "0.12 m²" format
  const areaStr = getValueWithMapping('Final area', ['Area - final', 'Area-final', 'area', 'Area']);
  const area = parseArea(areaStr);
  
  // Material
  const materialName = getValueWithMapping('Material name', ['Material-name', 'material', 'Material']);
  
  // Component ID
  const componentId = getValueWithMapping('Number', ['Designation', 'designation', 'Component ID', 'componentId']);
  
  // Name
  const name = getValueWithMapping('Name', ['Description', 'description', 'name']) || 
               componentId || 
               'Component';
  
  // Instance/Entity names (for CNC detection)
  const instanceType = getValueWithMapping('Entity names', ['Instance names', 'Instance-names', 'instanceType', 'Instance Type']);
  
  // Edge banding
  const edge1 = getValueWithMapping('Edge ymin', ['Edge Length 1', 'Edge-Length-1', 'edge1']);
  const edge2 = getValueWithMapping('Edge ymax', ['Edge Length 2', 'Edge-Length-2', 'edge2']);
  const edge3 = getValueWithMapping('Edge xmin', ['Edge Width 1', 'Edge-Width-1', 'edge3']);
  const edge4 = getValueWithMapping('Edge xmax', ['Edge Width 2', 'Edge-Width-2', 'edge4']);
  
  const component: ComponentData = {
    name: name,
    componentId: componentId,
    quantity: quantity,
    edge1: edge1,
    edge2: edge2,
    edge3: edge3,
    edge4: edge4,
    materialType: materialName,
    instanceType: instanceType || '',
    length: lengthValue,
    width: widthValue,
    area: area,
  };
  
  // Debug logging for first valid row
  if ((lengthValue > 0 || widthValue > 0 || quantity > 0 || area > 0 || materialName) && firstLog) {
    console.log('Mapped component:', {
      name,
      componentId,
      quantity,
      length: lengthValue,
      width: widthValue,
      thickness: thicknessValue,
      area,
      materialName,
      instanceType,
      isLexaCutFormat,
    });
  }
  
  return component;
}

/**
 * Parse number from string, handling various formats
 * - Removes non-numeric characters except decimal point
 * @param value - String value to parse
 * @returns Parsed number or 0 if invalid
 */
function parseNumber(value: string | undefined): number {
  if (!value) return 0;
  
  // Remove non-numeric characters except decimal point and minus
  const cleaned = String(value)
    .replace(/[^\d.-]/g, '')
    .trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse area value, handling "m²" suffix
 * Examples: "0.12 m²" → 0.12, "1.5 m²" → 1.5
 * @param value - String value with optional "m²" suffix
 * @returns Parsed area in m²
 */
function parseArea(value: string | undefined): number {
  if (!value) return 0;
  
  // Remove "m²" suffix and any whitespace
  const cleaned = String(value)
    .replace(/m²/g, '')
    .replace(/m\s*²/g, '')
    .trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse CSV with custom column mapping
 * @param input - Readable stream or Buffer
 * @param columnMap - Map of CSV column index to ComponentData field
 * @returns Promise resolving to array of ComponentData
 */
export async function parseCSVWithMapping(
  input: Readable | Buffer,
  columnMap: Record<number, keyof ComponentData>
): Promise<ComponentData[]> {
  const stream = (input instanceof Buffer ? Readable.from(input) : input) as Readable;
  const rows: CSVRow[] = [];
  
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (row: CSVRow) => rows.push(row))
      .on('end', () => {
        try {
          const components = rows.map((row) => {
            const keys = Object.keys(row);
            const component: Partial<ComponentData> = {};
            
            Object.entries(columnMap).forEach(([index, field]) => {
              const value = row[keys[parseInt(index)]];
              
              if (field === 'quantity' || field === 'length' || field === 'width' || field === 'area') {
                component[field] = parseNumber(value);
              } else {
                (component as any)[field] = value || '';
              }
            });
            
            return component as ComponentData;
          });
          resolve(components);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

/**
 * Validate ComponentData array
 * @param components - Array of components to validate
 * @returns Object with validation results
 */
export function validateComponents(components: ComponentData[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Filter out completely empty rows
  const validComponents = components.filter((comp, idx) => {
    const hasData = comp.length > 0 || comp.width > 0 || comp.quantity > 0 || comp.area > 0 || comp.materialType;
    if (!hasData) {
      warnings.push(`Row ${idx + 1}: Empty row skipped`);
      return false;
    }
    return true;
  });
  
  validComponents.forEach((component, index) => {
    const rowNum = index + 1;
    
    // Required fields check
    if (!component.name || component.name.trim() === '') {
      errors.push(`Row ${rowNum}: Missing component name`);
    }
    
    if (component.quantity <= 0) {
      errors.push(`Row ${rowNum}: Invalid quantity (${component.quantity})`);
    }
    
    if (!component.materialType || component.materialType.trim() === '') {
      warnings.push(`Row ${rowNum}: Missing material type`);
    }
    
    // Dimensional validation
    if (component.length <= 0 || component.width <= 0) {
      errors.push(`Row ${rowNum}: Invalid dimensions (L:${component.length}mm, W:${component.width}mm)`);
    }
    
    // Area validation (should match length * width approximately)
    // Allow some tolerance since area might be pre-calculated
    if (component.area > 0 && component.length > 0 && component.width > 0) {
      const calculatedArea = (component.length * component.width) / 1000000; // mm² to m²
      const difference = Math.abs(calculatedArea - component.area);
      const tolerance = Math.max(calculatedArea * 0.1, 0.01); // 10% tolerance or 0.01 m²
      if (difference > tolerance) {
        warnings.push(`Row ${rowNum}: Area mismatch (given: ${component.area}m², calculated: ${calculatedArea.toFixed(4)}m²)`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}


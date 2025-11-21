/**
 * Excel formula equivalents in TypeScript
 * Provides the same functionality as Excel formulas used in the VBA macros
 */

/**
 * SUM - Sums an array of numbers
 * Excel: =SUM(A7:A30)
 */
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + (val || 0), 0);
}

/**
 * SUMIF - Conditional sum
 * Excel: =SUMIF(range, criteria, sumRange)
 */
export function sumIf<T>(
  data: T[],
  criteria: (item: T) => boolean,
  getValue: (item: T) => number
): number {
  return data
    .filter(criteria)
    .reduce((acc, item) => acc + getValue(item), 0);
}

/**
 * VLOOKUP - Vertical lookup (exact match, returns undefined if not found)
 * Excel: =VLOOKUP(lookupValue, tableArray, colIndexNum, [rangeLookup])
 * 
 * @param lookupValue - Value to search for in first column
 * @param tableArray - 2D array or array of objects to search in
 * @param colIndex - Column index to return (1-based like Excel)
 * @param rangeLookup - If true, approximate match; if false, exact match (default: false)
 */
export function vlookup<T extends Record<string, any>>(
  lookupValue: any,
  tableArray: T[],
  colIndex: number,
  rangeLookup: boolean = false
): any | undefined {
  const keys = Object.keys(tableArray[0] || {});
  const lookupKey = keys[0]; // First column
  const returnKey = keys[colIndex - 1]; // Column to return (1-based index)
  
  if (rangeLookup) {
    // Approximate match (sorted ascending)
    let result: T | undefined;
    for (const row of tableArray) {
      if (row[lookupKey] <= lookupValue) {
        result = row;
      } else {
        break;
      }
    }
    return result ? result[returnKey] : undefined;
  } else {
    // Exact match
    const row = tableArray.find(item => item[lookupKey] === lookupValue);
    return row ? row[returnKey] : undefined;
  }
}

/**
 * VLOOKUP for simple array-based tables
 * @param lookupValue - Value to search for
 * @param table - Array of arrays [[key1, val1, ...], [key2, val2, ...]]
 * @param colIndex - 1-based column index to return
 */
export function vlookupArray(
  lookupValue: any,
  table: any[][],
  colIndex: number
): any | undefined {
  const row = table.find(r => r[0] === lookupValue);
  return row ? row[colIndex - 1] : undefined;
}

/**
 * ROUNDUP - Rounds a number up
 * Excel: =ROUNDUP(value, decimals)
 */
export function roundUp(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(value * multiplier) / multiplier;
}

/**
 * ROUND - Rounds a number to specified digits
 * Excel: =ROUND(value, decimals)
 */
export function round(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * CONCATENATE / & - Joins strings
 * Excel: =CONCATENATE(text1, text2, ...) or =A1&B1
 */
export function concatenate(...texts: (string | number | null | undefined)[]): string {
  return texts
    .map(t => t === null || t === undefined ? '' : String(t))
    .join('');
}

/**
 * IF - Conditional logic
 * Excel: =IF(condition, valueIfTrue, valueIfFalse)
 */
export function ifCondition<T, F>(
  condition: boolean,
  valueIfTrue: T,
  valueIfFalse: F
): T | F {
  return condition ? valueIfTrue : valueIfFalse;
}

/**
 * TRIM - Removes extra spaces
 * Excel: =TRIM(text)
 */
export function trim(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * REPLACE - Replaces text
 * Excel: Cells.Replace what:=find, Replacement:=replace
 */
export function replace(text: string, find: string, replaceWith: string): string {
  return text.replace(new RegExp(find, 'g'), replaceWith);
}

/**
 * COUNT - Counts numbers in array
 * Excel: =COUNT(range)
 */
export function count(values: any[]): number {
  return values.filter(v => typeof v === 'number' && !isNaN(v)).length;
}

/**
 * COUNTIF - Conditional count
 * Excel: =COUNTIF(range, criteria)
 */
export function countIf<T>(
  data: T[],
  criteria: (item: T) => boolean
): number {
  return data.filter(criteria).length;
}

/**
 * MAX - Returns maximum value
 * Excel: =MAX(range)
 */
export function max(values: number[]): number {
  return values.length > 0 ? Math.max(...values) : 0;
}

/**
 * MIN - Returns minimum value
 * Excel: =MIN(range)
 */
export function min(values: number[]): number {
  return values.length > 0 ? Math.min(...values) : 0;
}

/**
 * AVERAGE - Calculates average
 * Excel: =AVERAGE(range)
 */
export function average(values: number[]): number {
  return values.length > 0 ? sum(values) / values.length : 0;
}

/**
 * Excel-like cell reference parser
 * Converts "A1" to {row: 0, col: 0}
 */
export function parseCellReference(ref: string): { row: number; col: number } {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error(`Invalid cell reference: ${ref}`);
  
  const col = match[1].split('').reduce((acc, char) => 
    acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  const row = parseInt(match[2]) - 1;
  
  return { row, col };
}

/**
 * Excel-like range parser
 * Converts "A1:B10" to array of cell references
 */
export function parseRange(range: string): string[] {
  const [start, end] = range.split(':');
  const startCell = parseCellReference(start);
  const endCell = parseCellReference(end);
  
  const cells: string[] = [];
  for (let row = startCell.row; row <= endCell.row; row++) {
    for (let col = startCell.col; col <= endCell.col; col++) {
      const colLetter = String.fromCharCode(65 + col);
      cells.push(`${colLetter}${row + 1}`);
    }
  }
  
  return cells;
}


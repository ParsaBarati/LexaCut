/**
 * Persian/Farsi utilities for number and date formatting
 * Supports RTL text and Persian number formatting
 */

/** Persian digit mapping */
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Arabic digit mapping (alternative) */
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Convert English numbers to Persian digits
 * @param num - Number or string containing numbers
 * @returns String with Persian digits
 */
export function toPersianDigits(num: number | string): string {
  return String(num).replace(/\d/g, (digit) => PERSIAN_DIGITS[parseInt(digit)]);
}

/**
 * Convert Persian/Arabic digits to English numbers
 * @param str - String containing Persian/Arabic digits
 * @returns String with English digits
 */
export function toEnglishDigits(str: string): string {
  let result = str;
  
  // Replace Persian digits
  PERSIAN_DIGITS.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, 'g'), String(index));
  });
  
  // Replace Arabic digits
  ARABIC_DIGITS.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, 'g'), String(index));
  });
  
  return result;
}

/**
 * Format number as Persian currency (Rial)
 * Matches Excel format: "#,###_-[$ریال-fa-IR]"
 * 
 * @param amount - Amount in Rials
 * @param includeCurrency - Whether to include "ریال" suffix
 * @param usePersianDigits - Whether to use Persian digits
 * @returns Formatted string
 */
export function formatRial(
  amount: number,
  includeCurrency: boolean = true,
  usePersianDigits: boolean = true
): string {
  // Format with thousands separator
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  // Convert to Persian digits if requested
  const digitFormatted = usePersianDigits ? toPersianDigits(formatted) : formatted;
  
  // Add currency suffix
  return includeCurrency ? `${digitFormatted} ریال` : digitFormatted;
}

/**
 * Format number with Persian thousand separators
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @param usePersianDigits - Whether to use Persian digits
 * @returns Formatted string
 */
export function formatPersianNumber(
  num: number,
  decimals: number = 0,
  usePersianDigits: boolean = true
): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
  
  return usePersianDigits ? toPersianDigits(formatted) : formatted;
}

/**
 * Shamsi (Jalali) calendar month names
 */
const SHAMSI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

/**
 * Convert Gregorian date to Shamsi (Jalali) date
 * Using simple algorithm (not production-ready, consider using a library)
 * 
 * @param date - Gregorian Date object
 * @returns Shamsi date string
 */
export function toShamsiDate(date: Date): string {
  // This is a simplified conversion
  // For production, use a proper library like moment-jalaali
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Approximate Shamsi year (Gregorian - 621 or 622)
  const shamsiYear = year - (month < 3 || (month === 3 && day < 21) ? 622 : 621);
  
  // Simplified month mapping (not accurate for all dates)
  const monthMapping: Record<number, number> = {
    3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6,
    9: 7, 10: 8, 11: 9, 12: 10, 1: 11, 2: 12
  };
  
  const shamsiMonth = monthMapping[month] || 1;
  
  return `${shamsiYear}/${shamsiMonth.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

/**
 * Format date in Persian format with Persian digits
 * @param date - Date to format
 * @param usePersianDigits - Whether to use Persian digits
 * @returns Formatted date string
 */
export function formatPersianDate(
  date: Date,
  usePersianDigits: boolean = true
): string {
  const shamsi = toShamsiDate(date);
  return usePersianDigits ? toPersianDigits(shamsi) : shamsi;
}

/**
 * Get current Shamsi date string
 * @param usePersianDigits - Whether to use Persian digits
 * @returns Current Shamsi date
 */
export function getCurrentShamsiDate(usePersianDigits: boolean = true): string {
  return formatPersianDate(new Date(), usePersianDigits);
}

/**
 * Format area in square meters with m² symbol
 * @param area - Area value
 * @param usePersianDigits - Whether to use Persian digits
 * @returns Formatted area string
 */
export function formatArea(area: number, usePersianDigits: boolean = true): string {
  const formatted = area.toFixed(2);
  const digitFormatted = usePersianDigits ? toPersianDigits(formatted) : formatted;
  return `${digitFormatted} m²`;
}

/**
 * Format length in meters
 * @param length - Length value  
 * @param usePersianDigits - Whether to use Persian digits
 * @returns Formatted length string
 */
export function formatLength(length: number, usePersianDigits: boolean = true): string {
  const formatted = length.toFixed(2);
  const digitFormatted = usePersianDigits ? toPersianDigits(formatted) : formatted;
  return `${digitFormatted} m`;
}

/**
 * Check if text contains RTL characters (Persian/Arabic)
 * @param text - Text to check
 * @returns true if contains RTL characters
 */
export function isRTL(text: string): boolean {
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text);
}

/**
 * Add RTL marker to text if needed
 * @param text - Text to mark
 * @returns Text with RTL marker if contains RTL characters
 */
export function markRTL(text: string): string {
  return isRTL(text) ? `\u200F${text}` : text;
}


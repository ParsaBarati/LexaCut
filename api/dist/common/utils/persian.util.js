"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get formatArea () {
        return formatArea;
    },
    get formatLength () {
        return formatLength;
    },
    get formatPersianDate () {
        return formatPersianDate;
    },
    get formatPersianNumber () {
        return formatPersianNumber;
    },
    get formatRial () {
        return formatRial;
    },
    get getCurrentShamsiDate () {
        return getCurrentShamsiDate;
    },
    get isRTL () {
        return isRTL;
    },
    get markRTL () {
        return markRTL;
    },
    get toEnglishDigits () {
        return toEnglishDigits;
    },
    get toPersianDigits () {
        return toPersianDigits;
    },
    get toShamsiDate () {
        return toShamsiDate;
    }
});
/**
 * Persian/Farsi utilities for number and date formatting
 * Supports RTL text and Persian number formatting
 */ /** Persian digit mapping */ const PERSIAN_DIGITS = [
    '۰',
    '۱',
    '۲',
    '۳',
    '۴',
    '۵',
    '۶',
    '۷',
    '۸',
    '۹'
];
/** Arabic digit mapping (alternative) */ const ARABIC_DIGITS = [
    '٠',
    '١',
    '٢',
    '٣',
    '٤',
    '٥',
    '٦',
    '٧',
    '٨',
    '٩'
];
function toPersianDigits(num) {
    return String(num).replace(/\d/g, (digit)=>PERSIAN_DIGITS[parseInt(digit)]);
}
function toEnglishDigits(str) {
    let result = str;
    // Replace Persian digits
    PERSIAN_DIGITS.forEach((digit, index)=>{
        result = result.replace(new RegExp(digit, 'g'), String(index));
    });
    // Replace Arabic digits
    ARABIC_DIGITS.forEach((digit, index)=>{
        result = result.replace(new RegExp(digit, 'g'), String(index));
    });
    return result;
}
function formatRial(amount, includeCurrency = true, usePersianDigits = true) {
    // Format with thousands separator
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
    // Convert to Persian digits if requested
    const digitFormatted = usePersianDigits ? toPersianDigits(formatted) : formatted;
    // Add currency suffix
    return includeCurrency ? `${digitFormatted} ریال` : digitFormatted;
}
function formatPersianNumber(num, decimals = 0, usePersianDigits = true) {
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
    return usePersianDigits ? toPersianDigits(formatted) : formatted;
}
/**
 * Shamsi (Jalali) calendar month names
 */ const SHAMSI_MONTHS = [
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
    'اسفند'
];
function toShamsiDate(date) {
    // This is a simplified conversion
    // For production, use a proper library like moment-jalaali
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // Approximate Shamsi year (Gregorian - 621 or 622)
    const shamsiYear = year - (month < 3 || month === 3 && day < 21 ? 622 : 621);
    // Simplified month mapping (not accurate for all dates)
    const monthMapping = {
        3: 1,
        4: 2,
        5: 3,
        6: 4,
        7: 5,
        8: 6,
        9: 7,
        10: 8,
        11: 9,
        12: 10,
        1: 11,
        2: 12
    };
    const shamsiMonth = monthMapping[month] || 1;
    return `${shamsiYear}/${shamsiMonth.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}
function formatPersianDate(date, usePersianDigits = true) {
    const shamsi = toShamsiDate(date);
    return usePersianDigits ? toPersianDigits(shamsi) : shamsi;
}
function getCurrentShamsiDate(usePersianDigits = true) {
    return formatPersianDate(new Date(), usePersianDigits);
}
function formatArea(area, usePersianDigits = true) {
    const formatted = area.toFixed(2);
    const digitFormatted = usePersianDigits ? toPersianDigits(formatted) : formatted;
    return `${digitFormatted} m²`;
}
function formatLength(length, usePersianDigits = true) {
    const formatted = length.toFixed(2);
    const digitFormatted = usePersianDigits ? toPersianDigits(formatted) : formatted;
    return `${digitFormatted} m`;
}
function isRTL(text) {
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text);
}
function markRTL(text) {
    return isRTL(text) ? `\u200F${text}` : text;
}

//# sourceMappingURL=persian.util.js.map
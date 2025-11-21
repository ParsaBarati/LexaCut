/**
 * Excel formula equivalents in TypeScript
 * Provides the same functionality as Excel formulas used in the VBA macros
 */ /**
 * SUM - Sums an array of numbers
 * Excel: =SUM(A7:A30)
 */ "use strict";
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
    get average () {
        return average;
    },
    get concatenate () {
        return concatenate;
    },
    get count () {
        return count;
    },
    get countIf () {
        return countIf;
    },
    get ifCondition () {
        return ifCondition;
    },
    get max () {
        return max;
    },
    get min () {
        return min;
    },
    get parseCellReference () {
        return parseCellReference;
    },
    get parseRange () {
        return parseRange;
    },
    get replace () {
        return replace;
    },
    get round () {
        return round;
    },
    get roundUp () {
        return roundUp;
    },
    get sum () {
        return sum;
    },
    get sumIf () {
        return sumIf;
    },
    get trim () {
        return trim;
    },
    get vlookup () {
        return vlookup;
    },
    get vlookupArray () {
        return vlookupArray;
    }
});
function sum(values) {
    return values.reduce((acc, val)=>acc + (val || 0), 0);
}
function sumIf(data, criteria, getValue) {
    return data.filter(criteria).reduce((acc, item)=>acc + getValue(item), 0);
}
function vlookup(lookupValue, tableArray, colIndex, rangeLookup = false) {
    const keys = Object.keys(tableArray[0] || {});
    const lookupKey = keys[0]; // First column
    const returnKey = keys[colIndex - 1]; // Column to return (1-based index)
    if (rangeLookup) {
        // Approximate match (sorted ascending)
        let result;
        for (const row of tableArray){
            if (row[lookupKey] <= lookupValue) {
                result = row;
            } else {
                break;
            }
        }
        return result ? result[returnKey] : undefined;
    } else {
        // Exact match
        const row = tableArray.find((item)=>item[lookupKey] === lookupValue);
        return row ? row[returnKey] : undefined;
    }
}
function vlookupArray(lookupValue, table, colIndex) {
    const row = table.find((r)=>r[0] === lookupValue);
    return row ? row[colIndex - 1] : undefined;
}
function roundUp(value, decimals = 0) {
    const multiplier = Math.pow(10, decimals);
    return Math.ceil(value * multiplier) / multiplier;
}
function round(value, decimals = 0) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}
function concatenate(...texts) {
    return texts.map((t)=>t === null || t === undefined ? '' : String(t)).join('');
}
function ifCondition(condition, valueIfTrue, valueIfFalse) {
    return condition ? valueIfTrue : valueIfFalse;
}
function trim(text) {
    return text.replace(/\s+/g, ' ').trim();
}
function replace(text, find, replaceWith) {
    return text.replace(new RegExp(find, 'g'), replaceWith);
}
function count(values) {
    return values.filter((v)=>typeof v === 'number' && !isNaN(v)).length;
}
function countIf(data, criteria) {
    return data.filter(criteria).length;
}
function max(values) {
    return values.length > 0 ? Math.max(...values) : 0;
}
function min(values) {
    return values.length > 0 ? Math.min(...values) : 0;
}
function average(values) {
    return values.length > 0 ? sum(values) / values.length : 0;
}
function parseCellReference(ref) {
    const match = ref.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error(`Invalid cell reference: ${ref}`);
    const col = match[1].split('').reduce((acc, char)=>acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
    const row = parseInt(match[2]) - 1;
    return {
        row,
        col
    };
}
function parseRange(range) {
    const [start, end] = range.split(':');
    const startCell = parseCellReference(start);
    const endCell = parseCellReference(end);
    const cells = [];
    for(let row = startCell.row; row <= endCell.row; row++){
        for(let col = startCell.col; col <= endCell.col; col++){
            const colLetter = String.fromCharCode(65 + col);
            cells.push(`${colLetter}${row + 1}`);
        }
    }
    return cells;
}

//# sourceMappingURL=excel-functions.js.map
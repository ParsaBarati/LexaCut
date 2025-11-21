/**
 * LexaCut CSV Column Mapper
 * Explicit mapping between LexaCut export columns and backend ComponentData fields
 * This eliminates the need for fuzzy matching and ensures consistent parsing
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
    get LEXACUT_COLUMN_MAP () {
        return LEXACUT_COLUMN_MAP;
    },
    get getBackendFieldName () {
        return getBackendFieldName;
    },
    get getExpectedColumns () {
        return getExpectedColumns;
    },
    get validateHeaders () {
        return validateHeaders;
    }
});
const LEXACUT_COLUMN_MAP = {
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
    'Final area': 'area'
};
function getBackendFieldName(columnName) {
    // Exact match first
    if (LEXACUT_COLUMN_MAP[columnName]) {
        return LEXACUT_COLUMN_MAP[columnName];
    }
    // Case-insensitive match
    const normalizedColumn = columnName.trim();
    for (const [key, value] of Object.entries(LEXACUT_COLUMN_MAP)){
        if (key.toLowerCase() === normalizedColumn.toLowerCase()) {
            return value;
        }
    }
    return null;
}
function getExpectedColumns() {
    return Object.keys(LEXACUT_COLUMN_MAP);
}
function validateHeaders(headers) {
    const expectedColumns = getExpectedColumns();
    const normalizedHeaders = headers.map((h)=>h.trim());
    const foundColumns = [];
    const missingColumns = [];
    // Check for missing required columns
    for (const expected of expectedColumns){
        const found = normalizedHeaders.find((h)=>h.toLowerCase() === expected.toLowerCase());
        if (found) {
            foundColumns.push(expected);
        } else {
            // Only mark essential columns as missing
            const essentialColumns = [
                'Name',
                'Count',
                'Cutting length',
                'Cutting width',
                'Material name'
            ];
            if (essentialColumns.includes(expected)) {
                missingColumns.push(expected);
            }
        }
    }
    // Find extra columns (informational only, not an error)
    const extraColumns = normalizedHeaders.filter((header)=>{
        return !expectedColumns.find((expected)=>expected.toLowerCase() === header.toLowerCase());
    });
    return {
        isValid: missingColumns.length === 0,
        missingColumns,
        extraColumns,
        foundColumns
    };
}

//# sourceMappingURL=lexacut-column-mapper.js.map
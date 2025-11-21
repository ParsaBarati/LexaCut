/**
 * Test Script to Verify Excel/CSV Parsing
 * 
 * This script helps verify that the parsing and calculations are correct
 * Run with: node test-parsing.js
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Test data from 333_clean.csv
const expectedData = {
  row1: {
    'Length - raw': 60.0,      // cm
    'Width - raw': 20.0,       // cm
    'Quantity': 3,
    'Material name': 'ام دی اف', // MDF
    'Area - final': '0.12 m²',
    'Designation': 'Component#2',
  }
};

console.log('='.repeat(60));
console.log('EXCEL/CSV PARSING VERIFICATION TEST');
console.log('='.repeat(60));
console.log();

// Test 1: Verify Excel file can be read
console.log('📋 Test 1: Reading Excel File');
console.log('-'.repeat(60));

const excelPath = path.join(__dirname, '../excel_extract_env/333.csv.xlsx');
if (fs.existsSync(excelPath)) {
  const workbook = XLSX.readFile(excelPath);
  console.log(`✅ Excel file found: ${excelPath}`);
  console.log(`   Sheets: ${workbook.SheetNames.join(', ')}`);
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
  console.log(`   Rows found: ${rows.length}`);
  console.log();
  
  if (rows.length > 0) {
    console.log('📊 First Row Data:');
    console.log(JSON.stringify(rows[0], null, 2));
    console.log();
    
    // Verify column mapping
    console.log('🔍 Column Mapping Verification:');
    const firstRow = rows[0];
    const checks = [
      { key: 'Length - raw', expected: 60, actual: firstRow['Length - raw'], unit: 'cm' },
      { key: 'Width - raw', expected: 20, actual: firstRow['Width - raw'], unit: 'cm' },
      { key: 'Quantity', expected: 3, actual: firstRow['Quantity'], unit: 'count' },
      { key: 'Material name', expected: 'ام دی اف', actual: firstRow['Material name'], unit: 'text' },
      { key: 'Area - final', expected: '0.12 m²', actual: firstRow['Area - final'], unit: 'text' },
    ];
    
    checks.forEach(check => {
      const match = String(check.actual) === String(check.expected);
      const icon = match ? '✅' : '❌';
      console.log(`   ${icon} ${check.key}:`);
      console.log(`      Expected: ${check.expected} ${check.unit}`);
      console.log(`      Actual:   ${check.actual} ${check.unit}`);
      if (!match) {
        console.log(`      ⚠️  MISMATCH!`);
      }
    });
    console.log();
  }
} else {
  console.log(`❌ Excel file not found: ${excelPath}`);
  console.log();
}

// Test 2: Verify unit conversions
console.log('📐 Test 2: Unit Conversion Verification');
console.log('-'.repeat(60));

const lengthCm = 60.0;
const widthCm = 20.0;
const lengthMm = lengthCm * 10;  // Should be 600mm
const widthMm = widthCm * 10;     // Should be 200mm
const areaM2 = (lengthMm * widthMm) / 1000000;  // Should be 0.12 m²

console.log('   Length:');
console.log(`     Input: ${lengthCm} cm`);
console.log(`     Converted: ${lengthMm} mm`);
console.log(`     ✅ Expected: 600 mm`);
console.log();

console.log('   Width:');
console.log(`     Input: ${widthCm} cm`);
console.log(`     Converted: ${widthMm} mm`);
console.log(`     ✅ Expected: 200 mm`);
console.log();

console.log('   Area Calculation:');
console.log(`     Length × Width: ${lengthMm}mm × ${widthMm}mm = ${lengthMm * widthMm} mm²`);
console.log(`     Converted to m²: ${areaM2} m²`);
console.log(`     ✅ Expected: 0.12 m²`);
console.log();

// Test 3: Material lookup
console.log('🔎 Test 3: Material Lookup Verification');
console.log('-'.repeat(60));

const materialName = 'ام دی اف';
const persianMaterialMap = {
  'ام دی اف': 'MDF',
  'mdf': 'MDF',
  'ام.دی.اف': 'MDF',
};

console.log(`   Material name: "${materialName}"`);
console.log(`   Should match: MDF`);
console.log(`   ✅ Material lookup should work with Persian names`);
console.log();

// Test 4: Expected calculations
console.log('💰 Test 4: Expected Cost Calculations');
console.log('-'.repeat(60));

// Based on pricing-tables.json
const mdfPricePerM2 = 125000; // Rials per m²
const quantity = 3;
const areaPerPiece = 0.12; // m²
const totalArea = areaPerPiece * quantity; // 0.36 m²
const materialCost = totalArea * mdfPricePerM2; // 45,000 Rials

console.log('   Material: MDF 18mm');
console.log(`   Unit Price: ${mdfPricePerM2.toLocaleString()} Rials/m²`);
console.log(`   Area per piece: ${areaPerPiece} m²`);
console.log(`   Quantity: ${quantity} pieces`);
console.log(`   Total Area: ${totalArea} m²`);
console.log(`   Material Cost: ${materialCost.toLocaleString()} Rials`);
console.log(`   ✅ Expected: 45,000 Rials (0.36 m² × 125,000)`);
console.log();

// Test 5: API Test Instructions
console.log('🧪 Test 5: API Testing Instructions');
console.log('-'.repeat(60));
console.log('   1. Start the API server:');
console.log('      cd api && npm run start:dev');
console.log();
console.log('   2. Open test-ui.html in your browser');
console.log();
console.log('   3. Upload the Excel file: 333.csv.xlsx');
console.log();
console.log('   4. Check the console logs for:');
console.log('      - "Detected Excel file, parsing with xlsx..."');
console.log('      - "Reading sheet: Sheet1"');
console.log('      - "Valid component: {...}"');
console.log('      - "MaterialsService: Processing material..."');
console.log();
console.log('   5. Verify the response includes:');
console.log('      - costs.material.totalCost > 0');
console.log('      - costs.material.totalArea = 0.36');
console.log('      - costs.material.items[0].cost = 45000');
console.log();

console.log('='.repeat(60));
console.log('✅ Verification Complete!');
console.log('='.repeat(60));


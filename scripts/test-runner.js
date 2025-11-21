#!/usr/bin/env node

/**
 * Automated Test Runner for Cost Calculation API
 * 
 * Tests all test cases against expected results and generates a validation report
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

const API_URL = 'http://localhost:4492';
const TEST_CASES_DIR = path.join(__dirname, 'test-cases');

// Expected results for each test case
const expectedResults = {
  'test-case-1-single-material.csv': {
    name: 'Single Material, No Edges',
    material: { totalCost: 15000, totalArea: 0.12 },
    subtotal: 15000,
    finalPrice: 24797,
    tolerance: 1
  },
  'test-case-2-multiple-materials.csv': {
    name: 'Multiple Materials',
    material: { totalCost: 121800, totalArea: 1.08 },
    subtotal: 121800,
    finalPrice: 201348,
    tolerance: 1
  },
  'test-case-3-edge-banding.csv': {
    name: 'Edge Banding Scenarios',
    material: { totalCost: 189800 },
    navarShiar: { totalCost: 43750 },
    subtotal: 233550,
    finalPrice: 386081,
    tolerance: 5
  },
  'test-case-4-cnc-components.csv': {
    name: 'CNC Components',
    material: { totalCost: 139600 },
    cnc: { totalCost: 39000 },
    navarShiar: { totalCost: 15400 },
    subtotal: 194000,
    finalPrice: 320701,
    tolerance: 5
  },
  'test-case-5-complex.csv': {
    name: 'Complex Multi-Scenario',
    material: { totalCost: 460600 },
    navarShiar: { totalCost: 93800 },
    cnc: { totalCost: 54000 },
    subtotal: 608400,
    finalPrice: 1005746,
    tolerance: 10
  },
  'test-case-6-edge-cases.csv': {
    name: 'Edge Cases',
    material: { totalCost: 654500 },
    navarShiar: { totalCost: 210000 },
    subtotal: 864500,
    finalPrice: 1429105,
    tolerance: 10
  }
};

async function testCalculation(filename, expected) {
  const filePath = path.join(TEST_CASES_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return {
      filename,
      name: expected.name,
      status: 'SKIPPED',
      error: 'File not found'
    };
  }

  try {
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('projectData', JSON.stringify({
      name: `Test: ${expected.name}`,
      client: 'Automated Test',
      date: new Date().toISOString().split('T')[0]
    }));

    // Make API request
    const response = await fetch(`${API_URL}/api/v1/calculate/csv`, {
      method: 'POST',
      body: form
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        filename,
        name: expected.name,
        status: 'FAILED',
        error: result.message || 'API error',
        details: result
      };
    }

    // Verify results
    const checks = [];

    // Material cost
    if (expected.material) {
      const materialMatch = Math.abs(result.costs.material.totalCost - expected.material.totalCost) <= expected.tolerance;
      checks.push({
        category: 'Material Cost',
        expected: expected.material.totalCost,
        actual: result.costs.material.totalCost,
        pass: materialMatch,
        difference: result.costs.material.totalCost - expected.material.totalCost
      });

      if (expected.material.totalArea) {
        const areaMatch = Math.abs(result.costs.material.totalArea - expected.material.totalArea) <= 0.01;
        checks.push({
          category: 'Material Area',
          expected: expected.material.totalArea,
          actual: result.costs.material.totalArea,
          pass: areaMatch,
          difference: result.costs.material.totalArea - expected.material.totalArea
        });
      }
    }

    // NavarShiar cost
    if (expected.navarShiar) {
      const navarMatch = Math.abs(result.costs.navarShiar.totalCost - expected.navarShiar.totalCost) <= expected.tolerance;
      checks.push({
        category: 'NavarShiar Cost',
        expected: expected.navarShiar.totalCost,
        actual: result.costs.navarShiar.totalCost,
        pass: navarMatch,
        difference: result.costs.navarShiar.totalCost - expected.navarShiar.totalCost
      });
    }

    // CNC cost
    if (expected.cnc) {
      const cncMatch = Math.abs(result.costs.cnc.totalCost - expected.cnc.totalCost) <= expected.tolerance;
      checks.push({
        category: 'CNC Cost',
        expected: expected.cnc.totalCost,
        actual: result.costs.cnc.totalCost,
        pass: cncMatch,
        difference: result.costs.cnc.totalCost - expected.cnc.totalCost
      });
    }

    // Subtotal
    const subtotalMatch = Math.abs(result.financialSummary.subtotal - expected.subtotal) <= expected.tolerance;
    checks.push({
      category: 'Subtotal',
      expected: expected.subtotal,
      actual: result.financialSummary.subtotal,
      pass: subtotalMatch,
      difference: result.financialSummary.subtotal - expected.subtotal
    });

    // Final price
    const finalPriceMatch = Math.abs(result.financialSummary.finalPrice - expected.finalPrice) <= expected.tolerance;
    checks.push({
      category: 'Final Price',
      expected: expected.finalPrice,
      actual: result.financialSummary.finalPrice,
      pass: finalPriceMatch,
      difference: result.financialSummary.finalPrice - expected.finalPrice
    });

    const allPass = checks.every(c => c.pass);

    return {
      filename,
      name: expected.name,
      status: allPass ? 'PASSED' : 'FAILED',
      checks,
      result
    };

  } catch (error) {
    return {
      filename,
      name: expected.name,
      status: 'ERROR',
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('COST CALCULATION API - AUTOMATED TEST SUITE');
  console.log('='.repeat(80));
  console.log();

  // Check if API is running
  try {
    const healthCheck = await fetch(`${API_URL}/api/v1/calculate/health`);
    if (!healthCheck.ok) {
      console.error('❌ API is not responding. Please start the server:');
      console.error('   cd api && npm run start:dev');
      process.exit(1);
    }
    console.log('✅ API is running\n');
  } catch (error) {
    console.error('❌ Cannot connect to API at', API_URL);
    console.error('   Please start the server: cd api && npm run start:dev');
    process.exit(1);
  }

  const results = [];

  for (const [filename, expected] of Object.entries(expectedResults)) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`Testing: ${expected.name} (${filename})`);
    console.log('─'.repeat(80));

    const result = await testCalculation(filename, expected);
    results.push(result);

    if (result.status === 'PASSED') {
      console.log('✅ PASSED');
      result.checks.forEach(check => {
        console.log(`   ✓ ${check.category}: ${check.actual.toLocaleString()} (expected: ${check.expected.toLocaleString()})`);
      });
    } else if (result.status === 'FAILED') {
      console.log('❌ FAILED');
      result.checks.forEach(check => {
        const icon = check.pass ? '✓' : '✗';
        const color = check.pass ? '' : ' ⚠️';
        console.log(`   ${icon} ${check.category}: ${check.actual.toLocaleString()} (expected: ${check.expected.toLocaleString()})${color}`);
        if (!check.pass) {
          console.log(`      Difference: ${check.difference.toLocaleString()}`);
        }
      });
    } else if (result.status === 'SKIPPED') {
      console.log('⊘ SKIPPED:', result.error);
    } else {
      console.log('❌ ERROR:', result.error);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  const skipped = results.filter(r => r.status === 'SKIPPED').length;

  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Errors: ${errors}`);
  console.log(`⊘  Skipped: ${skipped}`);
  console.log();

  // Save detailed results
  const reportPath = path.join(__dirname, 'TEST_RESULTS.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed results saved to: TEST_RESULTS.json`);
  console.log();

  process.exit(failed > 0 || errors > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});


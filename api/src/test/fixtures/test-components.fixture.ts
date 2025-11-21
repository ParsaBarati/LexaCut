import { ComponentData, ProcessedComponent } from '../../common/interfaces';

/**
 * Test fixtures for component data
 * Based on real-world examples from 333.csv and other test cases
 */

/**
 * Simple component - MDF door
 */
export const simpleDoorComponent: ComponentData = {
  name: 'Cabinet Door',
  componentId: 'CD-001',
  quantity: 2,
  edge1: 'PVC',
  edge2: 'PVC',
  edge3: '',
  edge4: '',
  materialType: 'ام دی اف',
  instanceType: 'Cabinet-Standard',
  length: 600, // mm
  width: 400,  // mm
  area: 0.24,  // m²
};

/**
 * Drawer component with rails
 */
export const drawerComponent: ComponentData = {
  name: 'Drawer Front',
  componentId: 'DR-001',
  quantity: 3,
  edge1: 'PVC',
  edge2: 'PVC',
  edge3: 'PVC',
  edge4: 'PVC',
  materialType: 'ام دی اف',
  instanceType: 'Drawer-50cm',
  length: 500,
  width: 400,
  area: 0.20,
};

/**
 * CNC component
 */
export const cncComponent: ComponentData = {
  name: 'Hood Panel',
  componentId: 'HP-001',
  quantity: 1,
  edge1: '',
  edge2: '',
  edge3: '',
  edge4: '',
  materialType: 'ام دی اف',
  instanceType: 'CNC-Complex',
  length: 800,
  width: 600,
  area: 0.48,
};

/**
 * Thin plate component (< 5mm)
 */
export const plateComponent: ComponentData = {
  name: 'Back Panel',
  componentId: 'BP-001',
  quantity: 2,
  edge1: '',
  edge2: '',
  edge3: '',
  edge4: '',
  materialType: 'ام دی اف 3 میل - سفید',
  instanceType: 'Panel',
  length: 1000,
  width: 500,
  area: 0.50,
};

/**
 * Shelf component
 */
export const shelfComponent: ComponentData = {
  name: 'Cabinet Shelf',
  componentId: 'SH-001',
  quantity: 4,
  edge1: 'PVC',
  edge2: '',
  edge3: '',
  edge4: '',
  materialType: 'ام دی اف',
  instanceType: 'Shelf',
  length: 600,
  width: 350,
  area: 0.21,
};

/**
 * Complete test component set
 */
export const testComponentSet: ComponentData[] = [
  simpleDoorComponent,
  drawerComponent,
  cncComponent,
  shelfComponent,
];

/**
 * Processed component with calculated fields
 */
export const processedDoorComponent: ProcessedComponent = {
  ...simpleDoorComponent,
  sumArea: 0.48, // 0.24 * 2
  section1Value: 0.48,
  lengthQuantity: 12, // (600 * 2) / 100
  areaWithWaste: 0.552, // (600 * 400 * 2) * 1.15 / 10000
  doubleAreaWithWaste: 1.104, // ((600 * 400 * 2) * 2) * 1.15 / 10000
  cleanInstanceType: 'Cabinet-Standard',
  color: undefined,
  cutting_thickness: 18, // 18mm MDF
};

/**
 * Processed CNC component
 */
export const processedCNCComponent: ProcessedComponent = {
  ...cncComponent,
  sumArea: 0.48,
  section1Value: 0.48,
  lengthQuantity: 8,
  areaWithWaste: 0.552,
  doubleAreaWithWaste: 1.104,
  cleanInstanceType: 'Complex', // CNC- prefix removed
  color: undefined,
  cutting_thickness: 18,
};

/**
 * Processed plate component (thin)
 */
export const processedPlateComponent: ProcessedComponent = {
  ...plateComponent,
  sumArea: 1.00, // 0.50 * 2
  section1Value: 1.00,
  lengthQuantity: 20,
  areaWithWaste: 1.15,
  doubleAreaWithWaste: 2.30,
  cleanInstanceType: 'Panel',
  color: undefined,
  cutting_thickness: 3, // 3mm thin plate
};

/**
 * Full processed component set
 */
export const processedComponentSet: ProcessedComponent[] = [
  processedDoorComponent,
  {
    ...drawerComponent,
    sumArea: 0.60,
    section1Value: 0.60,
    lengthQuantity: 15,
    areaWithWaste: 0.69,
    doubleAreaWithWaste: 1.38,
    cleanInstanceType: 'Drawer-50cm',
    color: undefined,
    cutting_thickness: 18,
  },
  processedCNCComponent,
  {
    ...shelfComponent,
    sumArea: 0.84,
    section1Value: 0.84,
    lengthQuantity: 24,
    areaWithWaste: 0.966,
    doubleAreaWithWaste: 1.932,
    cleanInstanceType: 'Shelf',
    color: undefined,
    cutting_thickness: 18,
  },
];

/**
 * Component with multiple material types
 */
export const multiMaterialComponents: ComponentData[] = [
  {
    ...simpleDoorComponent,
    materialType: 'ام دی اف 16 میل - سفید',
  },
  {
    ...drawerComponent,
    materialType: 'پی وی سی 16 میل - سفید',
  },
  {
    ...shelfComponent,
    materialType: 'ام دی اف 16 میل - سفید',
  },
];

/**
 * Component with unknown material (for fallback testing)
 */
export const unknownMaterialComponent: ComponentData = {
  name: 'Unknown Material Part',
  componentId: 'UK-001',
  quantity: 1,
  edge1: '',
  edge2: '',
  edge3: '',
  edge4: '',
  materialType: 'مواد ناشناخته XYZ',
  instanceType: 'Standard',
  length: 500,
  width: 300,
  area: 0.15,
};

/**
 * Zero cost component (should trigger warnings)
 */
export const zeroCostComponent: ComponentData = {
  name: 'Zero Area Part',
  componentId: 'ZR-001',
  quantity: 0,
  edge1: '',
  edge2: '',
  edge3: '',
  edge4: '',
  materialType: 'ام دی اف',
  instanceType: 'Test',
  length: 0,
  width: 0,
  area: 0,
};


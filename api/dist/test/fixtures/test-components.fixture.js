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
    get cncComponent () {
        return cncComponent;
    },
    get drawerComponent () {
        return drawerComponent;
    },
    get multiMaterialComponents () {
        return multiMaterialComponents;
    },
    get plateComponent () {
        return plateComponent;
    },
    get processedCNCComponent () {
        return processedCNCComponent;
    },
    get processedComponentSet () {
        return processedComponentSet;
    },
    get processedDoorComponent () {
        return processedDoorComponent;
    },
    get processedPlateComponent () {
        return processedPlateComponent;
    },
    get shelfComponent () {
        return shelfComponent;
    },
    get simpleDoorComponent () {
        return simpleDoorComponent;
    },
    get testComponentSet () {
        return testComponentSet;
    },
    get unknownMaterialComponent () {
        return unknownMaterialComponent;
    },
    get zeroCostComponent () {
        return zeroCostComponent;
    }
});
const simpleDoorComponent = {
    name: 'Cabinet Door',
    componentId: 'CD-001',
    quantity: 2,
    edge1: 'PVC',
    edge2: 'PVC',
    edge3: '',
    edge4: '',
    materialType: 'ام دی اف',
    instanceType: 'Cabinet-Standard',
    length: 600,
    width: 400,
    area: 0.24
};
const drawerComponent = {
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
    area: 0.20
};
const cncComponent = {
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
    area: 0.48
};
const plateComponent = {
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
    area: 0.50
};
const shelfComponent = {
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
    area: 0.21
};
const testComponentSet = [
    simpleDoorComponent,
    drawerComponent,
    cncComponent,
    shelfComponent
];
const processedDoorComponent = {
    ...simpleDoorComponent,
    sumArea: 0.48,
    section1Value: 0.48,
    lengthQuantity: 12,
    areaWithWaste: 0.552,
    doubleAreaWithWaste: 1.104,
    cleanInstanceType: 'Cabinet-Standard',
    color: undefined,
    cutting_thickness: 18
};
const processedCNCComponent = {
    ...cncComponent,
    sumArea: 0.48,
    section1Value: 0.48,
    lengthQuantity: 8,
    areaWithWaste: 0.552,
    doubleAreaWithWaste: 1.104,
    cleanInstanceType: 'Complex',
    color: undefined,
    cutting_thickness: 18
};
const processedPlateComponent = {
    ...plateComponent,
    sumArea: 1.00,
    section1Value: 1.00,
    lengthQuantity: 20,
    areaWithWaste: 1.15,
    doubleAreaWithWaste: 2.30,
    cleanInstanceType: 'Panel',
    color: undefined,
    cutting_thickness: 3
};
const processedComponentSet = [
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
        cutting_thickness: 18
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
        cutting_thickness: 18
    }
];
const multiMaterialComponents = [
    {
        ...simpleDoorComponent,
        materialType: 'ام دی اف 16 میل - سفید'
    },
    {
        ...drawerComponent,
        materialType: 'پی وی سی 16 میل - سفید'
    },
    {
        ...shelfComponent,
        materialType: 'ام دی اف 16 میل - سفید'
    }
];
const unknownMaterialComponent = {
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
    area: 0.15
};
const zeroCostComponent = {
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
    area: 0
};

//# sourceMappingURL=test-components.fixture.js.map
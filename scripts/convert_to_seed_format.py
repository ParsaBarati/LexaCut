#!/usr/bin/env python3
"""
Convert the extracted pricing data to the format expected by the seed script
"""
import json

# Read the extracted data
with open('api/src/data/pricing-tables-complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Convert materials to expected format
materials = []
for mat in data['materials']:
    materials.append({
        "code": mat['code'],
        "description": mat['name'],
        "unit": mat['unit'],
        "unitPrice": mat['unitPrice'],
        "category": "Panel",
        "persianNames": [mat['name']],
        "isActive": True
    })

# Convert edge banding to expected format
edge_banding = []
for eb in data['edgeBanding']:
    edge_banding.append({
        "code": eb['code'],
        "description": eb['name'],
        "unit": eb['unit'],
        "unitPrice": eb['pricePerMeter'],
        "isActive": True
    })

# Convert CNC operations to expected format
cnc_operations = []
for cnc in data['cncOperations']:
    cnc_operations.append({
        "code": cnc['code'],
        "description": cnc['name'],
        "unit": cnc['unit'],
        "unitPrice": cnc['unitPrice'],
        "isActive": True
    })

# Convert fittings to expected format
fittings = []
for fit in data['fittings']:
    fittings.append({
        "code": fit['code'],
        "name": fit['name'],
        "unit": fit['unit'],
        "unitPrice": fit['unitPrice'],
        "qtyPerFitting": 1,
        "isActive": True
    })

# Create the final pricing tables JSON
pricing_tables = {
    "materials": materials,
    "edgeBanding": edge_banding,
    "cncOperations": cnc_operations
}

# Create the fittings catalog JSON
fittings_catalog = {
    "fittings": fittings
}

# Write the converted data
with open('api/src/data/pricing-tables.json', 'w', encoding='utf-8') as f:
    json.dump(pricing_tables, f, ensure_ascii=False, indent=2)

with open('api/src/data/fittings-catalog.json', 'w', encoding='utf-8') as f:
    json.dump(fittings_catalog, f, ensure_ascii=False, indent=2)

print("✅ Conversion complete!")
print(f"  Materials: {len(materials)}")
print(f"  Edge Banding: {len(edge_banding)}")
print(f"  CNC Operations: {len(cnc_operations)}")
print(f"  Fittings: {len(fittings)}")


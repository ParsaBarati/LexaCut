#!/bin/bash
# Test the Cost Analysis API without opening SketchUp
# This tests the backend calculation engine directly

echo "🧪 Testing Cost Analysis API..."
echo ""

# Make sure API is running
echo "1️⃣ Checking if API is running on port 4492..."
if curl -s http://localhost:4492/api/v1/calculate/health > /dev/null 2>&1; then
    echo "✅ API is running"
else
    echo "❌ API is not running. Starting it..."
    echo "Run in another terminal: cd api && npm run start:dev"
    exit 1
fi

echo ""
echo "2️⃣ Testing direct calculation endpoint..."

# Test payload matching what the plugin sends
curl -s -X POST http://localhost:4492/api/v1/calculate/direct \
  -H "Content-Type: application/json" \
  -d '{
    "projectData": {
      "projectName": "Test Kitchen",
      "clientName": "Test Client",
      "contractDate": "2025-01-15",
      "wastePercentage": 0.15
    },
    "parts": [
      {
        "number": "1.1",
        "name": "Cabinet Door",
        "count": 2,
        "cutting_length": 600,
        "cutting_width": 400,
        "cutting_thickness": 18,
        "material_name": "ام دی اف",
        "entity_names": "Cabinet-Standard",
        "edge_ymin": "PVC",
        "edge_ymax": "PVC",
        "edge_xmin": "",
        "edge_xmax": "",
        "final_area": 0.24
      },
      {
        "number": "2.1",
        "name": "Drawer Front",
        "count": 3,
        "cutting_length": 500,
        "cutting_width": 400,
        "cutting_thickness": 18,
        "material_name": "ام دی اف",
        "entity_names": "Drawer-50cm",
        "edge_ymin": "PVC",
        "edge_ymax": "PVC",
        "edge_xmin": "PVC",
        "edge_xmax": "PVC",
        "final_area": 0.20
      }
    ]
  }' | python3 -m json.tool

echo ""
echo "✅ Test complete!"
echo ""
echo "💡 Tips:"
echo "  - Modify the JSON above to test different scenarios"
echo "  - Check that all cost categories return values"
echo "  - Verify fittings are calculated for doors/drawers"
echo "  - Run unit tests: cd api && npm test"


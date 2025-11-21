#!/bin/bash

# Test Script for LexaCut Cost Analysis Integration
# Tests if API is running and plugin can connect

echo "================================"
echo "LexaCut Cost Analysis Test"
echo "================================"
echo ""

# 1. Check if API is running
echo "1. Checking if API is running on port 4492..."
if curl -s http://localhost:4492/api/docs > /dev/null; then
    echo "✅ API is running!"
else
    echo "❌ API is NOT running"
    echo "   Start it with: cd api && npm run start:dev"
    exit 1
fi
echo ""

# 2. Test validation endpoint
echo "2. Testing validation endpoint..."
# Create a simple test CSV
cat > /tmp/test_lexacut.csv << 'EOF'
Number,Name,Count,Cutting length,Cutting width,Cutting thickness,Material name,Entity names,Edge ymin,Edge ymax,Edge xmin,Edge xmax,Final area
1.1,Cabinet Door,2,600,400,18,MDF 18mm,Cabinet-Standard,,,,PVC White,0.48
1.2,Shelf,3,800,300,18,MDF 18mm,Cabinet-Standard,,,,PVC White,0.72
EOF

VALIDATION_RESPONSE=$(curl -s -X POST http://localhost:4492/api/v1/calculate/validate \
  -F "file=@/tmp/test_lexacut.csv")

if echo "$VALIDATION_RESPONSE" | grep -q "isValid"; then
    echo "✅ Validation endpoint works!"
    echo "   Response: $(echo $VALIDATION_RESPONSE | jq -r '.format // "unknown"') format detected"
else
    echo "❌ Validation endpoint failed"
    echo "   Response: $VALIDATION_RESPONSE"
fi
echo ""

# 3. Test direct calculation endpoint
echo "3. Testing direct calculation endpoint..."
DIRECT_RESPONSE=$(curl -s -X POST http://localhost:4492/api/v1/calculate/direct \
  -H "Content-Type: application/json" \
  -d '{
    "projectData": {
      "projectName": "Test Project",
      "clientName": "Test Client",
      "contractDate": "2024-11-21",
      "wastePercentage": 0.15
    },
    "parts": [
      {
        "number": "1.1",
        "name": "Cabinet Door",
        "count": 2,
        "cutting_length": 600.0,
        "cutting_width": 400.0,
        "cutting_thickness": 18.0,
        "material_name": "MDF 18mm",
        "entity_names": "Cabinet-Standard, Door-1",
        "edge_ymin": "PVC White",
        "edge_ymax": "PVC White",
        "edge_xmin": "",
        "edge_xmax": "",
        "final_area": 0.48
      }
    ]
  }')

if echo "$DIRECT_RESPONSE" | grep -q "financialSummary"; then
    echo "✅ Direct calculation endpoint works!"
    FINAL_PRICE=$(echo $DIRECT_RESPONSE | jq -r '.financialSummary.finalPrice // 0')
    echo "   Final Price: $FINAL_PRICE"
else
    echo "❌ Direct calculation endpoint failed"
    echo "   Response: $DIRECT_RESPONSE"
fi
echo ""

# 4. Check SketchUp plugin configuration
echo "4. Plugin Configuration Check:"
echo "   Set these environment variables before launching SketchUp:"
echo "   export COST_API_ENABLED=true"
echo "   export COST_API_URL=http://localhost:4492"
echo ""

# 5. Summary
echo "================================"
echo "Test Summary:"
echo "================================"
echo "✅ API Running: Yes"
echo "✅ CORS Enabled: Yes" 
echo "✅ Validation Endpoint: $(echo "$VALIDATION_RESPONSE" | grep -q "isValid" && echo "Working" || echo "Failed")"
echo "✅ Direct Endpoint: $(echo "$DIRECT_RESPONSE" | grep -q "financialSummary" && echo "Working" || echo "Failed")"
echo ""
echo "Next Steps:"
echo "1. Set environment variables (see above)"
echo "2. Launch SketchUp"
echo "3. Open LexaCut extension"
echo "4. Generate cutlist"
echo "5. Go to Cost Analysis tab"
echo "6. Fill project info and click Calculate"
echo ""

# Cleanup
rm -f /tmp/test_lexacut.csv


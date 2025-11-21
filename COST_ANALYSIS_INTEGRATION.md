# Cost Analysis Integration - LexaCut & Backend

This document describes the integration between LexaCut SketchUp plugin and the backend cost calculation API.

## Overview

The integration provides two workflows:

1. **Phase 1: Optimized CSV Export & Import** - Enhanced CSV export with better column mapping
2. **Phase 2: Direct API Integration** - Real-time cost calculation from within LexaCut plugin

## Phase 1: Optimized CSV Export

### Export from LexaCut

The CSV export has been optimized with consistent column names that map directly to backend fields:

| LexaCut Column | Backend Field | Description |
|----------------|---------------|-------------|
| Number | componentId | Part identification number |
| Name | name | Component name |
| Count | quantity | Quantity of parts |
| Cutting length | length | Length in mm (already converted) |
| Cutting width | width | Width in mm (already converted) |
| Cutting thickness | thickness | Thickness in mm |
| Material name | materialType | Material specification |
| Entity names | instanceType | Instance type (for CNC detection) |
| Edge ymin | edge1 | Edge banding - bottom |
| Edge ymax | edge2 | Edge banding - top |
| Edge xmin | edge3 | Edge banding - left |
| Edge xmax | edge4 | Edge banding - right |
| Final area | area | Final area in m² |

### Import in Admin Panel

The admin panel now supports three import formats:

1. **Auto-detect** (Recommended) - Automatically detects format
2. **LexaCut Optimized** - Uses explicit column mapping
3. **Legacy Format** - For older 333.csv files

### Validation Endpoint

Before processing, you can validate CSV structure:

```bash
POST /api/v1/calculate/validate
Content-Type: multipart/form-data

# Returns:
{
  "isValid": true,
  "format": "lexacut", 
  "headers": ["Number", "Name", ...],
  "foundColumns": [...],
  "rowCount": 50,
  "validComponents": 48
}
```

## Phase 2: Direct API Integration

### Setup

#### 1. Cost Analysis is Enabled by Default

The Cost Analysis feature is **enabled by default** in LexaCut. No environment variables needed!

The plugin will automatically connect to `http://localhost:4492`.

**Optional: Custom Configuration**

If you need to change the API URL or disable the feature:

**macOS/Linux:**
```bash
# Change API URL (optional)
export COST_API_URL=http://your-api-server:4492

# Disable Cost Analysis (optional)
export COST_API_ENABLED=false
```

**Windows:**
```cmd
# Change API URL (optional)
set COST_API_URL=http://your-api-server:4492

# Disable Cost Analysis (optional)
set COST_API_ENABLED=false
```

#### 2. Start Backend API

```bash
cd api
npm run start:dev
```

The API runs on `http://localhost:4492` by default.

### Using Cost Analysis Tab

1. **Start the Backend API** (must be running)
   ```bash
   cd api && npm run start:dev
   ```
2. **Launch SketchUp** (Cost Analysis is enabled by default)
3. **Open LexaCut extension**
4. **Generate cutlist** in the Cutlist tab
5. **Switch to Cost Analysis tab** (will be visible automatically)
6. **Fill in project information:**
   - Project Name
   - Client Name
   - Waste Percentage (default: 15%)
4. **Click "Calculate Cost"**
5. **View results** with cost breakdown and financial summary

### API Endpoint

**Direct Calculation:**
```http
POST /api/v1/calculate/direct
Content-Type: application/json

{
  "projectData": {
    "projectName": "Kitchen Cabinet",
    "clientName": "John Doe",
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
}
```

**Response:**
```json
{
  "project": {
    "name": "Kitchen Cabinet",
    "client": "John Doe",
    "date": "2024-11-21"
  },
  "costs": {
    "material": { "totalCost": 1200000, "items": [...] },
    "cnc": { "totalCost": 150000, "items": [...] },
    "navarShiar": { "totalCost": 80000, "items": [...] },
    "fittings": { "totalCost": 200000, "items": [...] }
  },
  "financialSummary": {
    "subtotal": 1630000,
    "overheads": { "totalOverheads": 538900 },
    "totalWithOverheads": 2168900,
    "profitAmount": 477158,
    "finalPrice": 2646058
  }
}
```

## Architecture

### LexaCut Plugin Components

```
src/ladb_lexacut/
├── ruby/
│   ├── constants.rb                       # COST_API_URL, COST_API_ENABLED
│   ├── controller/
│   │   └── cost_analysis_controller.rb    # Handles commands
│   ├── worker/cutlist/
│   │   └── cutlist_cost_analysis_worker.rb # API communication
│   └── plugin.rb                          # Controller registration
├── js/plugins/tabs/
│   └── jquery.ladb.tab-costanalysis.js    # Tab UI logic
└── twig/tabs/costanalysis/
    └── tab.twig                           # Tab HTML template
```

### Backend API Components

```
api/src/
├── modules/cost-calculation/
│   ├── cost-calculation.controller.ts     # /api/v1/calculate/* endpoints
│   └── cost-calculation.service.ts        # Calculation logic
├── common/
│   ├── dto/
│   │   └── calculation.dto.ts             # DirectCalculationDto, DirectPartDto
│   └── utils/
│       ├── lexacut-column-mapper.ts       # Explicit column mapping
│       └── csv-parser.util.ts             # CSV parsing with format detection
└── main.ts                                # CORS configuration
```

## Data Flow

### Phase 1: CSV Workflow
```
SketchUp Model
  ↓
LexaCut Generate Cutlist
  ↓
Export Button → CSV File (optimized format)
  ↓
Admin Panel → Upload CSV
  ↓
Backend parseCSV() → Detects format (LexaCut/Legacy)
  ↓
Explicit column mapping (no fuzzy matching)
  ↓
Cost Calculation Service
  ↓
Results displayed in Admin Panel
```

### Phase 2: Direct API Workflow
```
SketchUp Model
  ↓
LexaCut Generate Cutlist
  ↓
Cost Analysis Tab → Click "Calculate Cost"
  ↓
CutlistCostAnalysisWorker serializes parts
  ↓
HTTP POST to /api/v1/calculate/direct
  ↓
Backend receives structured data (no parsing needed)
  ↓
Cost Calculation Service
  ↓
JSON response → Displayed in plugin
```

## Benefits

### Phase 1 Improvements
- ✅ **No fuzzy matching** - Exact column name mapping
- ✅ **Format detection** - Auto-detects LexaCut vs Legacy
- ✅ **Better validation** - Validates before processing
- ✅ **Backward compatible** - Legacy CSV files still work

### Phase 2 Advantages
- ✅ **No file management** - Direct API calls
- ✅ **Real-time feedback** - Instant cost calculations
- ✅ **No parsing overhead** - Structured data from start
- ✅ **Better UX** - Results shown in SketchUp
- ✅ **Design iteration** - Recalculate after changes

## Troubleshooting

### Cost Analysis Tab Not Showing

**The tab is enabled by default.** If it's not showing:

1. **Check if API is running:**
   ```bash
   curl http://localhost:4492/api/docs
   # Should return Swagger UI
   ```

2. **Check plugin configuration in SketchUp Ruby Console:**
   ```ruby
   Ladb::LexaCut::COST_API_ENABLED  # Should be true
   Ladb::LexaCut::COST_API_URL      # Should be http://localhost:4492
   ```

3. **If you disabled it**, re-enable by unsetting the environment variable:
   ```bash
   unset COST_API_ENABLED  # macOS/Linux
   # or restart SketchUp without the variable
   ```

### API Connection Failed

**Check backend is running:**
```bash
curl http://localhost:4492/api/docs
# Should return Swagger UI
```

**Check firewall:** Ensure port 4492 is not blocked.

### Column Mapping Errors (Phase 1)

**Validate CSV structure:**
```bash
curl -X POST http://localhost:4492/api/v1/calculate/validate \
  -F "file=@your_file.csv"
```

**Check response** for missing or extra columns.

## Testing

### Test Phase 1 (CSV Export)

1. Open SketchUp with LexaCut installed
2. Create/open a model with components
3. Generate cutlist in Cutlist tab
4. Click Export button
5. Save CSV file
6. Go to Admin Panel → Calculator
7. Upload CSV file
8. Select "LexaCut Optimized" format
9. Fill project info and calculate

### Test Phase 2 (Direct API)

1. Start backend:
   ```bash
   cd api && npm run start:dev
   ```
2. Launch SketchUp (Cost Analysis is enabled by default)
3. Open LexaCut extension
4. Generate cutlist
5. Switch to "Cost Analysis" tab (should be visible)
6. Fill project information
7. Click "Calculate Cost"
8. View results in the tab

## API Documentation

Full API documentation available at:
```
http://localhost:4492/api/docs
```

## Security Notes

### Development
- CORS is set to `*` for development
- No authentication required

### Production Recommendations
1. **Configure CORS** properly in `api/src/main.ts`
2. **Add authentication** (API keys, OAuth)
3. **Use HTTPS** for API calls
4. **Rate limiting** to prevent abuse
5. **Input sanitization** (already implemented)

## Future Enhancements

- [ ] Offline caching for when API is unavailable
- [ ] Batch processing for multiple projects
- [ ] Real-time cost updates as model changes
- [ ] Export cost reports as PDF from plugin
- [ ] Material cost optimization suggestions
- [ ] Historical cost tracking

## Support

For issues or questions:
- Check backend logs: API console output
- Check plugin logs: SketchUp Ruby Console
- Validate API: Test endpoints with curl/Postman
- Review Swagger docs: http://localhost:4492/api/docs


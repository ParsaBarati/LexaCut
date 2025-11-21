# LexaCut Cost Calculation API

TypeScript/NestJS API that replicates the functionality of `ANALIZ-MALI-GHARARDAD-BIM.xlsm` Excel file.

## Overview

This API processes woodworking project data (from CSV or JSON) and calculates:
- Material costs
- Cutting/machining costs (BoreshKari)
- CNC operations
- Edge banding (NavarShiar)
- Fittings/hardware
- Painting/finishing
- Final pricing with overheads and profit margins

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Access the API
curl http://localhost:3000/api/v1/calculate/health

# View Swagger documentation
open http://localhost:3000/api/docs
```

## API Endpoints

### 1. Calculate from JSON

**POST** `/api/v1/calculate/full`

```bash
curl -X POST http://localhost:3000/api/v1/calculate/full \
  -H "Content-Type: application/json" \
  -d '{
    "projectData": {
      "projectName": "Kitchen Cabinet",
      "clientName": "John Doe",
      "contractDate": "2024-01-15",
      "wastePercentage": 0.15
    },
    "components": [
      {
        "name": "Cabinet Door",
        "componentId": "CD-001",
        "quantity": 4,
        "edge1": "PVC",
        "edge2": "PVC",
        "materialType": "MDF 18mm",
        "instanceType": "Cabinet-Standard",
        "length": 600,
        "width": 400,
        "area": 0.24
      }
    ]
  }'
```

### 2. Calculate from CSV

**POST** `/api/v1/calculate/csv`

```bash
curl -X POST http://localhost:3000/api/v1/calculate/csv \
  -F "file=@components.csv" \
  -F 'projectData={"projectName":"Test Project","clientName":"Test Client","contractDate":"2024-01-15","wastePercentage":0.15}'
```

### 3. Get Pricing Configuration

**GET** `/api/v1/calculate/config/pricing`

```bash
curl http://localhost:3000/api/v1/calculate/config/pricing
```

### 4. Health Check

**GET** `/api/v1/calculate/health`

```bash
curl http://localhost:3000/api/v1/calculate/health
```

## CSV Format

The CSV file should match the "All" sheet structure from Excel:

```csv
name,componentId,quantity,edge1,edge2,edge3,edge4,materialType,instanceType,length,width,area
Cabinet Door,CD-001,4,PVC,PVC,,,MDF 18mm,Cabinet-Standard,600,400,0.24
Shelf,SH-001,8,,,,,,MDF 18mm,Shelf,600,300,0.18
```

## Response Format

```json
{
  "project": {
    "name": "Kitchen Cabinet",
    "client": "John Doe",
    "date": "2024-01-15"
  },
  "costs": {
    "material": {
      "category": "Material",
      "totalCost": 850000,
      "items": [...]
    },
    "boreshKari": {
      "category": "BoreshKari",
      "totalCost": 120000,
      "items": [...]
    },
    ...
  },
  "financialSummary": {
    "subtotal": 1500000,
    "breakdown": {
      "material": 850000,
      "boreshKari": 120000,
      "navarShiar": 80000,
      "cnc": 150000,
      "fittings": 200000,
      "painting": 100000,
      "woodTools": 0,
      "plate": 0
    },
    "overheads": {
      "overhead1": 375000,
      "overhead2": 60000,
      "overhead3": 30000,
      "overhead4": 30000,
      "contingency": 37500,
      "totalOverheads": 532500
    },
    "totalWithOverheads": 2032500,
    "finalPrice": 2479650,
    "profitAmount": 447150,
    "profitPercentage": 0.22
  },
  "calculatedAt": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## Excel Mapping

This API exactly replicates these Excel sheets:

| Excel Sheet | API Service | Function |
|------------|-------------|----------|
| All | CostCalculationService | Data processing and cleaning |
| Material | MaterialsService | Material costs with Pivot Table |
| BoreshKari | CostCalculationService | Cutting costs |
| CNC | CostCalculationService | CNC machining costs |
| NavarShiarFarsi | CostCalculationService | Edge banding costs |
| Fittings | (TODO) | Hardware/fittings costs |
| Painting | CostCalculationService | Painting costs |
| Plate | CostCalculationService | Sheet materials |
| WoodTools | CostCalculationService | Tool costs |
| روکش مالی | PricingService | Overhead & profit calculations |
| قرارداد | (TODO) | Contract generation |

## Overhead & Profit Configuration

Default configuration (matching Excel):
- Overhead 1: 25% (general overhead)
- Overhead 2: 4% (administrative)
- Overhead 3: 2% (additional)
- Overhead 4: 2% (additional)
- Contingency: 2.5%
- Profit Margin: 22%

## SketchUp Ruby Integration

Example Ruby code for calling the API:

```ruby
require 'net/http'
require 'json'
require 'uri'

def calculate_project_cost(components_csv_path, project_data)
  uri = URI.parse('http://localhost:3000/api/v1/calculate/csv')
  
  request = Net::HTTP::Post::Multipart.new(uri.path,
    'file' => UploadIO.new(components_csv_path, 'text/csv'),
    'projectData' => project_data.to_json
  )
  
  response = Net::HTTP.start(uri.hostname, uri.port) do |http|
    http.request(request)
  end
  
  JSON.parse(response.body)
end

# Usage
project_data = {
  projectName: 'My Project',
  clientName: 'Client Name',
  contractDate: Time.now.strftime('%Y-%m-%d'),
  wastePercentage: 0.15
}

result = calculate_project_cost('/path/to/components.csv', project_data)
puts "Final Price: #{result['financialSummary']['finalPrice']}"
```

## Development

```bash
# Run tests
npm test

# Run in watch mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod
```

## Environment Variables

```bash
PORT=3000                    # API port
NODE_ENV=development         # Environment
```

## Architecture

```
api/
├── src/
│   ├── modules/
│   │   ├── cost-calculation/  # Main calculation orchestrator
│   │   ├── materials/          # Material cost calculations
│   │   ├── pricing/            # Overhead & profit calculations
│   │   ├── fittings/           # (TODO) Fittings calculations
│   │   └── contract/           # (TODO) Contract generation
│   ├── common/
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── interfaces/         # TypeScript interfaces
│   │   └── utils/              # Excel functions, Persian utils, CSV parser
│   ├── data/
│   │   ├── pricing-tables.json # Material/edge/CNC pricing
│   │   └── fittings-catalog.json # Fittings catalog
│   └── config/                 # Configuration
└── test/                       # Tests
```

## Notes

- All calculations match the Excel file exactly
- Supports Persian number formatting and RTL text
- CSV parsing handles the "All" sheet structure
- Pricing tables are in JSON format (easy to update)
- Fully documented with Swagger/OpenAPI
- CORS enabled for SketchUp extension integration

## License

MIT

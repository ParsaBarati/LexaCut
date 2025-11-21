import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Readable } from 'stream';
import { CostCalculationService } from './cost-calculation.service';
import {
  CalculateFullCostDto,
  ProjectDataDto,
  PricingConfigDto,
  DirectCalculationDto,
  DirectPartDto,
} from '../../common/dto/calculation.dto';
import { parseCSV, validateComponents } from '../../common/utils/csv-parser.util';
import { validateHeaders } from '../../common/utils/lexacut-column-mapper';
import { CalculationResult, ComponentData } from '../../common/interfaces';

/**
 * Cost Calculation API Controller
 * Main endpoint for processing CSV and calculating costs
 */
@ApiTags('Cost Calculation')
@Controller('api/v1/calculate')
export class CostCalculationController {
  constructor(
    private readonly costCalculationService: CostCalculationService
  ) {}

  /**
   * Calculate full cost from JSON payload
   * POST /api/v1/calculate/full
   */
  @Post('full')
  @ApiOperation({ summary: 'Calculate full project cost from JSON data' })
  @ApiResponse({
    status: 200,
    description: 'Calculation result with financial summary',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async calculateFullCost(
    @Body() dto: CalculateFullCostDto
  ): Promise<CalculationResult> {
    try {
      // Validate components
      const validation = validateComponents(dto.components);
      if (!validation.isValid) {
        throw new HttpException(
          {
            message: 'Invalid component data',
            errors: validation.errors,
            warnings: validation.warnings,
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Calculate
      const result = await this.costCalculationService.calculateFullCost(
        dto.components,
        dto.projectData
      );

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Calculation failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Validate CSV file structure without running full calculation
   * POST /api/v1/calculate/validate
   */
  @Post('validate')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Validate CSV structure without calculation' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Validation result with detailed feedback',
  })
  @ApiResponse({ status: 400, description: 'Invalid file or structure' })
  async validateCSV(
    @UploadedFile() file: any
  ): Promise<{
    isValid: boolean;
    format: 'lexacut' | 'legacy' | 'unknown';
    headers: string[];
    missingColumns?: string[];
    extraColumns?: string[];
    foundColumns?: string[];
    rowCount: number;
    validComponents: number;
    errors?: string[];
    warnings?: string[];
  }> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      // Parse CSV to get headers and basic structure
      const stream = Readable.from(file.buffer);
      const csv = require('csv-parser');
      const rows: any[] = [];
      let headers: string[] = [];

      await new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on('headers', (hdrs: string[]) => {
            headers = hdrs;
          })
          .on('data', (row: any) => {
            rows.push(row);
            // Only collect first 100 rows for validation
            if (rows.length >= 100) {
              resolve(rows);
            }
          })
          .on('end', () => resolve(rows))
          .on('error', reject);
      });

      // Validate headers against LexaCut format
      const headerValidation = validateHeaders(headers);

      // Determine format
      const isLexaCutFormat = headers.some(h => h.toLowerCase() === 'cutting length');
      const format = isLexaCutFormat ? 'lexacut' : 
                     headers.some(h => h.toLowerCase().includes('length - raw')) ? 'legacy' : 
                     'unknown';

      // Try to parse components for additional validation
      let validComponents = 0;
      const errors: string[] = [];
      const warnings: string[] = [];

      try {
        const stream2 = Readable.from(file.buffer);
        const components = await parseCSV(stream2);
        validComponents = components.length;

        if (validComponents === 0) {
          errors.push('No valid components found in CSV');
        } else if (validComponents < rows.length * 0.5) {
          warnings.push(`Only ${validComponents} out of ${rows.length} rows could be parsed as valid components`);
        }
      } catch (parseError: any) {
        errors.push(`Parsing error: ${parseError.message}`);
      }

      // Add warnings for missing optional columns
      if (!headerValidation.isValid && headerValidation.missingColumns.length > 0) {
        warnings.push(`Missing recommended columns: ${headerValidation.missingColumns.join(', ')}`);
      }

      return {
        isValid: headerValidation.isValid && validComponents > 0,
        format,
        headers,
        missingColumns: headerValidation.missingColumns,
        extraColumns: headerValidation.extraColumns,
        foundColumns: headerValidation.foundColumns,
        rowCount: rows.length,
        validComponents,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          message: 'Validation failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Calculate cost directly from LexaCut plugin (no CSV)
   * POST /api/v1/calculate/direct
   */
  @Post('direct')
  @ApiOperation({ summary: 'Calculate cost from direct API call (LexaCut plugin)' })
  @ApiResponse({
    status: 200,
    description: 'Calculation result with financial summary (JSON)',
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async calculateDirect(
    @Body() dto: DirectCalculationDto
  ): Promise<CalculationResult> {
    try {
      // Transform DirectPartDto to ComponentData format
      const components: ComponentData[] = dto.parts.map(part => ({
        name: part.name,
        componentId: part.number,
        quantity: part.count,
        edge1: part.edge_ymin || '',
        edge2: part.edge_ymax || '',
        edge3: part.edge_xmin || '',
        edge4: part.edge_xmax || '',
        materialType: part.material_name,
        instanceType: part.entity_names,
        length: part.cutting_length,
        width: part.cutting_width,
        area: part.final_area,
      }));

      // Validate components
      const validation = validateComponents(components);
      if (!validation.isValid) {
        throw new HttpException(
          {
            message: 'Component validation failed',
            errors: validation.errors,
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Calculate using the service
      const result = await this.costCalculationService.calculateFullCost(
        components,
        dto.projectData
      );

      return result;
    } catch (error: any) {
      console.error('Direct calculation error:', error);
      throw new HttpException(
        {
          message: 'Calculation failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Calculate cost from CSV file upload
   * POST /api/v1/calculate/csv
   */
  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Calculate cost from CSV or Excel file upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Calculation result with financial summary (JSON)',
  })
  @ApiResponse({ status: 400, description: 'Invalid CSV/Excel file or data' })
  async calculateFromCSV(
    @UploadedFile() file: any,
    @Body('projectData') projectDataJson: string
  ): Promise<CalculationResult> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      // Parse project data from JSON string
      const projectData: ProjectDataDto = JSON.parse(projectDataJson);

      // Parse CSV
      const stream = Readable.from(file.buffer);
      let components: ComponentData[];
      
      try {
        components = await parseCSV(stream);
      } catch (error) {
        // If CSV parsing fails, show raw file content for debugging
        const fileContent = file.buffer.toString('utf-8');
        const firstLines = fileContent.split('\n').slice(0, 5).join('\n');
        
        throw new HttpException(
          {
            message: 'CSV parsing failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            filePreview: firstLines,
            fileSize: file.size,
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Debug logging
      console.log(`Parsed ${components.length} components from CSV`);
      if (components.length > 0) {
        console.log('First component:', JSON.stringify(components[0], null, 2));
      } else {
        // If no components, show raw CSV content for debugging
        const fileContent = file.buffer.toString('utf-8');
        const firstLines = fileContent.split('\n').slice(0, 10).join('\n');
        console.log('CSV file content (first 10 lines):', firstLines);
      }

      // Validate
      const validation = validateComponents(components);
      if (!validation.isValid && components.length === 0) {
        // If no components at all, show more details
        const fileContent = file.buffer.toString('utf-8');
        const firstLines = fileContent.split('\n').slice(0, 10).join('\n');
        
        throw new HttpException(
          {
            message: 'No valid components found in CSV',
            errors: [
              'CSV file appears to be empty or contains no valid data rows',
              ...validation.errors.slice(0, 5), // Show first 5 errors
            ],
            warnings: validation.warnings.slice(0, 5),
            csvPreview: firstLines,
            hint: 'Please check that your CSV has the correct column headers: Length - raw, Width - raw, Quantity, Material name, etc.',
          },
          HttpStatus.BAD_REQUEST
        );
      }
      
      if (!validation.isValid) {
        throw new HttpException(
          {
            message: 'Invalid CSV data',
            errors: validation.errors,
            warnings: validation.warnings,
          },
          HttpStatus.BAD_REQUEST
        );
      }

      if (components.length === 0) {
        throw new HttpException(
          {
            message: 'No valid components found in CSV',
            errors: ['CSV file appears to be empty or contains no valid data rows'],
          },
          HttpStatus.BAD_REQUEST
        );
      }

      // Calculate
      const result = await this.costCalculationService.calculateFullCost(
        components,
        projectData
      );

      // Debug logging
      console.log(`Calculation complete. Material cost: ${result.costs.material.totalCost}`);

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof SyntaxError) {
        throw new HttpException(
          'Invalid project data JSON',
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        {
          message: 'CSV processing failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get current pricing configuration
   * GET /api/v1/calculate/config/pricing
   */
  @Get('config/pricing')
  @ApiOperation({ summary: 'Get current pricing configuration' })
  @ApiResponse({ status: 200, description: 'Pricing configuration' })
  async getPricingConfig(): Promise<PricingConfigDto> {
    // This would come from PricingService
    return {
      overhead1: 0.25,
      overhead2: 0.04,
      overhead3: 0.02,
      overhead4: 0.02,
      contingency: 0.025,
      profitMargin: 0.22,
    };
  }

  /**
   * Debug endpoint - Parse file and show detailed information
   * POST /api/v1/calculate/debug
   */
  @Post('debug')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Debug: Parse file and show detailed parsing info' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Detailed parsing information' })
  async debugParse(
    @UploadedFile() file: any
  ): Promise<any> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const stream = Readable.from(file.buffer);
      const components = await parseCSV(stream);
      
      // Calculate costs to show full processing
      const projectData: ProjectDataDto = {
        name: 'Debug Test',
        client: 'Debug',
        date: new Date().toISOString().split('T')[0],
      };
      
      const result = await this.costCalculationService.calculateFullCost(
        components,
        projectData
      );

      return {
        fileInfo: {
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          isExcel: file.buffer[0] === 0x50 && file.buffer[1] === 0x4B,
        },
        parsed: {
          componentCount: components.length,
          components: components.map(comp => ({
            name: comp.name,
            componentId: comp.componentId,
            quantity: comp.quantity,
            length: comp.length,
            width: comp.width,
            area: comp.area,
            materialType: comp.materialType,
            instanceType: comp.instanceType,
            edges: {
              edge1: comp.edge1,
              edge2: comp.edge2,
              edge3: comp.edge3,
              edge4: comp.edge4,
            },
          })),
        },
        calculations: {
          material: {
            totalCost: result.costs.material.totalCost,
            totalArea: result.costs.material.totalArea,
            totalQuantity: result.costs.material.totalQuantity,
            items: result.costs.material.items,
          },
          subtotal: result.financialSummary.subtotal,
          finalPrice: result.financialSummary.finalPrice,
        },
        verification: {
          expectedMaterialCost: components.length > 0 && components[0].materialType === 'ام دی اف' 
            ? (components[0].area * components[0].quantity * 125000).toLocaleString() + ' Rials'
            : 'N/A',
          note: 'For 333.csv.xlsx: Expected material cost = 0.36 m² × 125,000 = 45,000 Rials',
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Debug parsing failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Health check endpoint
   * GET /api/v1/calculate/health
   */
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async health(): Promise<{ status: string; version: string }> {
    return {
      status: 'ok',
      version: '1.0.0',
    };
  }
}


import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for Project Data
 */
export class ProjectDataDto {
  @ApiProperty({ description: 'Project name', example: 'Kitchen Cabinet Project' })
  @IsString()
  @IsNotEmpty()
  projectName!: string;

  @ApiProperty({ description: 'Client name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @ApiProperty({ description: 'Contract date', example: '2024-01-15' })
  @IsString()
  @IsNotEmpty()
  contractDate!: string;

  @ApiPropertyOptional({ description: 'Custom fields', example: { field1: 'value1' } })
  @IsOptional()
  customFields?: Record<string, string>;

  @ApiProperty({ description: 'Waste percentage (e.g., 0.15 for 15%)', example: 0.15 })
  @IsNumber()
  @Min(0)
  wastePercentage!: number;
}

/**
 * DTO for Component Data (from CSV)
 */
export class ComponentDataDto {
  @ApiProperty({ description: 'Component name', example: 'Cabinet Door' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Component ID', example: 'CD-001' })
  @IsString()
  @IsNotEmpty()
  componentId!: string;

  @ApiProperty({ description: 'Quantity', example: 4 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({ description: 'Edge property 1', example: 'PVC' })
  @IsOptional()
  @IsString()
  edge1?: string;

  @ApiPropertyOptional({ description: 'Edge property 2', example: 'PVC' })
  @IsOptional()
  @IsString()
  edge2?: string;

  @ApiPropertyOptional({ description: 'Edge property 3' })
  @IsOptional()
  @IsString()
  edge3?: string;

  @ApiPropertyOptional({ description: 'Edge property 4' })
  @IsOptional()
  @IsString()
  edge4?: string;

  @ApiProperty({ description: 'Material type', example: 'MDF 18mm' })
  @IsString()
  @IsNotEmpty()
  materialType!: string;

  @ApiProperty({ description: 'Instance type', example: 'Cabinet-Standard' })
  @IsString()
  @IsNotEmpty()
  instanceType!: string;

  @ApiProperty({ description: 'Length in mm', example: 600 })
  @IsNumber()
  @Min(0)
  length!: number;

  @ApiProperty({ description: 'Width in mm', example: 400 })
  @IsNumber()
  @Min(0)
  width!: number;

  @ApiProperty({ description: 'Area in m²', example: 0.24 })
  @IsNumber()
  @Min(0)
  area!: number;
}

/**
 * DTO for Full Calculation Request
 */
export class CalculateFullCostDto {
  @ApiProperty({ description: 'Project metadata', type: ProjectDataDto })
  @ValidateNested()
  @Type(() => ProjectDataDto)
  @IsNotEmpty()
  projectData!: ProjectDataDto;

  @ApiProperty({ description: 'Array of components', type: [ComponentDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentDataDto)
  @IsNotEmpty()
  components!: ComponentDataDto[];
}

/**
 * DTO for Pricing Configuration Update
 */
export class PricingConfigDto {
  @ApiPropertyOptional({ description: 'General overhead (0.25 = 25%)', example: 0.25 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  overhead1?: number;

  @ApiPropertyOptional({ description: 'Administrative overhead (0.04 = 4%)', example: 0.04 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  overhead2?: number;

  @ApiPropertyOptional({ description: 'Additional overhead 1 (0.02 = 2%)', example: 0.02 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  overhead3?: number;

  @ApiPropertyOptional({ description: 'Additional overhead 2 (0.02 = 2%)', example: 0.02 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  overhead4?: number;

  @ApiPropertyOptional({ description: 'Contingency (0.025 = 2.5%)', example: 0.025 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  contingency?: number;

  @ApiPropertyOptional({ description: 'Profit margin (0.22 = 22%)', example: 0.22 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  profitMargin?: number;
}

/**
 * DTO for CSV Upload Request
 */
export class UploadCsvDto {
  @ApiProperty({ description: 'Project metadata', type: ProjectDataDto })
  @ValidateNested()
  @Type(() => ProjectDataDto)
  @IsNotEmpty()
  projectData!: ProjectDataDto;
}

/**
 * DTO for Direct Part Data (from LexaCut plugin)
 */
export class DirectPartDto {
  @ApiProperty({ description: 'Part number', example: '1.1' })
  @IsString()
  number!: string;

  @ApiProperty({ description: 'Part name', example: 'Cabinet Door' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Quantity/count', example: 2 })
  @IsNumber()
  @Min(0)
  count!: number;

  @ApiProperty({ description: 'Cutting length in mm', example: 600 })
  @IsNumber()
  @Min(0)
  cutting_length!: number;

  @ApiProperty({ description: 'Cutting width in mm', example: 400 })
  @IsNumber()
  @Min(0)
  cutting_width!: number;

  @ApiProperty({ description: 'Cutting thickness in mm', example: 18 })
  @IsNumber()
  @Min(0)
  cutting_thickness!: number;

  @ApiProperty({ description: 'Material name', example: 'MDF 18mm' })
  @IsString()
  @IsNotEmpty()
  material_name!: string;

  @ApiProperty({ description: 'Entity/instance names', example: 'Cabinet-Standard, Door-1' })
  @IsString()
  entity_names!: string;

  @ApiPropertyOptional({ description: 'Edge ymin' })
  @IsOptional()
  @IsString()
  edge_ymin?: string;

  @ApiPropertyOptional({ description: 'Edge ymax' })
  @IsOptional()
  @IsString()
  edge_ymax?: string;

  @ApiPropertyOptional({ description: 'Edge xmin' })
  @IsOptional()
  @IsString()
  edge_xmin?: string;

  @ApiPropertyOptional({ description: 'Edge xmax' })
  @IsOptional()
  @IsString()
  edge_xmax?: string;

  @ApiProperty({ description: 'Final area in m²', example: 0.24 })
  @IsNumber()
  @Min(0)
  final_area!: number;
}

/**
 * DTO for Direct Calculation Request (from LexaCut plugin API call)
 */
export class DirectCalculationDto {
  @ApiProperty({ description: 'Project metadata', type: ProjectDataDto })
  @ValidateNested()
  @Type(() => ProjectDataDto)
  @IsNotEmpty()
  projectData!: ProjectDataDto;

  @ApiProperty({ description: 'Array of parts from LexaCut', type: [DirectPartDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DirectPartDto)
  @IsNotEmpty()
  parts!: DirectPartDto[];
}


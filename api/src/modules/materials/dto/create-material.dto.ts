import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({ description: 'Unique material code', example: 'MAT001' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Material description', example: 'MDF 18mm' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Unit of measurement', example: 'm²' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Price per unit', example: 125000 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Material category', example: 'Sheet' })
  @IsString()
  category: string;

  @ApiProperty({ 
    description: 'Array of Persian names for matching', 
    example: ['ام دی اف', 'MDF'], 
    type: [String] 
  })
  @IsArray()
  @IsString({ each: true })
  persianNames: string[];

  @ApiProperty({ description: 'Is material active', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


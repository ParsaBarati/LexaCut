import { IsString, IsNumber, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFittingDto {
  @ApiProperty({ description: 'Unique fitting code', example: 'FIT001' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Fitting name', example: 'Cabinet Hinge - Soft Close' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Unit of measurement', example: 'piece' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Price per unit', example: 15000 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Quantity per fitting', example: 2, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  qtyPerFitting?: number;

  @ApiProperty({ description: 'Is fitting active', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


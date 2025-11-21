import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCNCOperationDto {
  @ApiProperty({ description: 'Unique CNC operation code', example: 'CNC001' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'CNC operation description', example: 'Drilling Operation' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Unit of measurement', example: 'piece' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Price per unit', example: 5000 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Is CNC operation active', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePricingConfigDto {
  @ApiProperty({ description: 'Overhead 1 percentage', example: 0.25, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  overhead1?: number;

  @ApiProperty({ description: 'Overhead 2 percentage', example: 0.04, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  overhead2?: number;

  @ApiProperty({ description: 'Overhead 3 percentage', example: 0.02, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  overhead3?: number;

  @ApiProperty({ description: 'Overhead 4 percentage', example: 0.02, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  overhead4?: number;

  @ApiProperty({ description: 'Contingency percentage', example: 0.025, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  contingency?: number;

  @ApiProperty({ description: 'Profit margin percentage', example: 0.22, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  profitMargin?: number;
}


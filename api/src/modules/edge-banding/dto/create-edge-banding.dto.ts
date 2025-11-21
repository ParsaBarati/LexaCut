import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEdgeBandingDto {
  @ApiProperty({ description: 'Unique edge banding code', example: 'EDGE001' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Edge banding description', example: 'PVC Edge 2mm White' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Unit of measurement', example: 'm' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Price per unit', example: 3500 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Is edge banding active', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


import { PartialType } from '@nestjs/swagger';
import { CreateEdgeBandingDto } from './create-edge-banding.dto';

export class UpdateEdgeBandingDto extends PartialType(CreateEdgeBandingDto) {}


import { PartialType } from '@nestjs/swagger';
import { CreateCNCOperationDto } from './create-cnc-operation.dto';

export class UpdateCNCOperationDto extends PartialType(CreateCNCOperationDto) {}


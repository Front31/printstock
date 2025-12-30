import { IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsageDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  gramsUsed: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  usageDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  printerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  modelId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

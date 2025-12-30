import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilamentDto {
  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  material: string;

  @ApiProperty()
  @IsString()
  colorName: string;

  @ApiProperty()
  @IsString()
  colorHex: string;

  @ApiProperty()
  @IsNumber()
  diameter: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalWeight: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  remainingWeight: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  store?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  opened?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  openedDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

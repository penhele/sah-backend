import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSavingDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;
}

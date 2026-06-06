import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSavingDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @IsString()
    @IsNotEmpty()
    userId: string
}

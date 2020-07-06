import { IsNotEmpty, IsString } from "class-validator";

export class UpdateServiceDto {

    @IsNotEmpty()
    @IsString()
    servicioId: string;

    @IsNotEmpty()
    @IsString()
    newValue: string;

    @IsNotEmpty()
    @IsString()
    especialidadId:string;
}
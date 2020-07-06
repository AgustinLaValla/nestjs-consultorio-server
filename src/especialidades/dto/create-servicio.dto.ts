import { IsNotEmpty, IsString } from "class-validator";

export class CreateServicioDto {
    @IsNotEmpty()
    @IsString()
    servicioName:string;

    @IsNotEmpty()
    @IsString()
    especialidadId:string;
}
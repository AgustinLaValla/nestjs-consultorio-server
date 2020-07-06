import { IsNotEmpty, IsString, IsIn, IsOptional } from "class-validator";
import { Generos } from "../interfaces/miembro-genero.interface";


export class AddMiembroDto {

    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    especialidad: string;

    @IsNotEmpty()
    @IsIn([Generos.femenino, Generos.masculino])
    genero?: Generos;

    @IsOptional()
    image:string;

    @IsNotEmpty()
    @IsString({each:true})
    mutualesAdheridas?: string[];

}
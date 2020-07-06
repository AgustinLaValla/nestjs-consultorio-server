import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class UpdatePacientDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsString()
    obraSocial: string;

    @IsOptional()
    @IsString()
    numeroDeAfiliado: string;

    @IsOptional()
    @IsString()
    telefono: string;

    @IsNotEmpty()
    @IsString()
    dni: string;
    
    @IsNotEmpty()
    @IsString()
    nacimiento?: string;

    @IsNotEmpty()
    @IsNumber()
    nacimientoSeconds?: number;

    @IsNotEmpty()
    @IsString()
    _id:string;
}
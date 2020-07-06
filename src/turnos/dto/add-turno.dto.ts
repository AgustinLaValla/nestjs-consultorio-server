import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class AddTurnoDto {

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
    desde: string;

    @IsNotEmpty()
    @IsString()
    hasta: string;

    @IsNotEmpty()
    @IsString()
    consulta:string;

    @IsNotEmpty()
    @IsString()
    dni:string;

    @IsNotEmpty()
    @IsNumber()
    dateInSeconds: number;

    @IsNotEmpty()
    @IsString()
    especialistaId?:string;

    @IsNotEmpty()
    @IsString()
    nacimiento?: string;

    @IsNotEmpty()
    @IsNumber()
    nacimientoSeconds?: number;
}

import { IsNotEmpty, IsString } from "class-validator";

export class CreateEspecialidadDto {
    @IsNotEmpty()
    @IsString()
    nombreEspecialidad:string;
};
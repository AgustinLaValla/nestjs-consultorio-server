import { AddTurnoDto } from "./add-turno.dto";
import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class UpdateTurnoDto extends AddTurnoDto {
    @IsOptional()
    @IsString()
    diagnostico:string;

    @IsNotEmpty()
    @IsString()
    _id:string
}
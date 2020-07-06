import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMutualDto {
    @IsNotEmpty()
    @IsString()
    nombre:string;
};
import { Generos } from "./miembro-genero.interface";
import { Mutual } from "src/mutuales/interfaces/mutual.interface";
import { Document } from "mongoose";

export interface Miembro extends Document {
    apellido: string;
    nombre: string;
    especialidad: string;
    photoURL?: string;
    genero?: Generos;
    mutualesAdheridas?: Array<string | Mutual>;
    picId:string;
};

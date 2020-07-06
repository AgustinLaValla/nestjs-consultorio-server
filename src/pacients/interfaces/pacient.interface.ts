import { Document } from 'mongoose';

export interface Pacient extends Document {
    nombre:string;
    apellido:string;
    dni:string;
    obraSocial:string;
    numeroDeAfiliado?:string;
    telefono?:string;
    nacimiento:string;
    nacimientoSeconds:number;
}
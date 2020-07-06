import { Document } from 'mongoose';
import { Mutual } from 'src/mutuales/interfaces/mutual.interface';
import { Servicio } from 'src/especialidades/interfaces/servicio.interface';

export interface Turno extends Document {
    nombre:string;
    apellido:string;
    obraSocial: string | Mutual;
    numeroDeAfiliado?:string;
    telefono?:string;
    desde: string;
    hasta: string;
    consulta?:string | Servicio;
    diagnostico?:string;
    id?: string;
    dni:string;
    dateInSeconds: number;
    especialistaId?:string;
    nacimiento?: string;
    nacimiento_seconds?: number;
}


import { Document } from 'mongoose';

export interface Servicio extends Document {
    nombre:string;
}
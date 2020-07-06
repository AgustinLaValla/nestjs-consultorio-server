import { Document } from "mongoose"
import { Servicio } from "./servicio.interface";

export interface Especialidad extends Document { 
    nombreEspecialidad:string;
    servicios?: Servicio[];
};

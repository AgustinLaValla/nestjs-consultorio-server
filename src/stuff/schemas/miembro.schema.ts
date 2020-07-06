import { Schema } from "mongoose";
import { Generos } from "../interfaces/miembro-genero.interface";

export const miembroSchema = new Schema({
    apellido: { type: String, required: true },
    nombre: { type: String, required: true },
    especialidad: { type: Schema.Types.ObjectId, required: true, ref: 'Especialidad' },
    photoURL: { type: String, required: true },
    genero: { type: Generos, required: true },
    mutualesAdheridas: [
        { type: Schema.Types.ObjectId, required: true, ref: 'Mutual' }
    ],
    picId:{ type:String, required:true }
});


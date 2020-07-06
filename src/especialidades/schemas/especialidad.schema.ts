import { Schema } from "mongoose";

export const especialidadSchema = new Schema({
    nombreEspecialidad: { type: String, required: true, unique: true },
    servicios: [
        { type:Schema.Types.ObjectId, ref:'Servicio', required:true }
    ]
});

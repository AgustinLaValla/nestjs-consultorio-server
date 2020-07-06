import { Schema } from "mongoose";

export const pacientSchema = new Schema({
    nombre: { type:String, required:true },
    apellido: { type:String, required:true },
    dni: { type:String, required:true, unique:true },
    obraSocial: { type:Schema.Types.ObjectId, ref: 'Mutual', required:true },
    numeroDeAfiliado: { type:String, required:false },
    telefono: { type:String, required:false },
    nacimiento: { type:String, required:true },
    nacimientoSeconds: { type:Number, required:true },
    turnos: [
        { type:Schema.Types.ObjectId, ref:'Turno', required:true }
    ]
})
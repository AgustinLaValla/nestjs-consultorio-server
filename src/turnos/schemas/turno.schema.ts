import { Schema } from 'mongoose';

export const turnoSchema = new Schema({
    nombre: { type:String, required:true },
    apellido: { type:String, required:true },
    obraSocial: { type:Schema.Types.ObjectId, required:true, ref:'Mutual' },
    numeroDeAfiliado: {type:String, required:false, default:null },
    telefono: { type:String, required:false, default:null },
    desde: { type:String, required:true },
    hasta: { type:String, required:true },
    consulta: { type:Schema.Types.ObjectId, ref:'Servicio',required:true },
    especialistaId: { type:Schema.Types.ObjectId, required:true, ref:'Miembro' },
    diagnostico: { type:String, required:false },
    dni: { type:String, required:true },
    dateInSeconds: { type:Number, required:true },
    nacimiento: { type:String, required:true },
    nacimientoSeconds: { type:Number, required:true }

})
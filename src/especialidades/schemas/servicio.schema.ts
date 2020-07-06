import { Schema } from 'mongoose';

export const servicioSchema = new Schema({
    nombre: { type:String, required:true, unique:false }
})
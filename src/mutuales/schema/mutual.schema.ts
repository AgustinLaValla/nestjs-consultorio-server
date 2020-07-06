import { Schema } from 'mongoose'; 

export const mutualSchema = new Schema({
    nombre: { type:String, required:true, unique:true }
});
/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Miembro } from './interfaces/miembro.interface';
import { Model } from 'mongoose';
import { AddMiembroDto } from './dto/add-miembro.dto';
import { Generos } from './interfaces/miembro-genero.interface';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { isNullOrUndefined } from 'util';

config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

@Injectable()
export class StuffService {
    constructor(@InjectModel('Miembro') private miembroModel: Model<Miembro>) { }

    async getStuff(): Promise<Miembro[]> {
        return await this.miembroModel.find().populate('mutualesAdheridas').populate({
            path: 'especialidad',
            populate: {
                path: 'servicios',
                select: 'nombre'
            }
        });
    }

    async getMiembro(id: string): Promise<Miembro> {
        const miembro = await this.miembroModel.findById(id).populate('mutualesAdheridas').populate({
            path: 'especialidad',
            populate: {
                path: 'servicios',
                select: 'nombre'
            }
        });
        if (!miembro) throw new NotFoundException('Miembro Not Found');
        return miembro;
    }

    async addMiembro(addMiembroDto: AddMiembroDto): Promise<Miembro> {
        const { apellido, nombre, especialidad, genero, mutualesAdheridas } = addMiembroDto;
        let image: string;
        let picId: string;

        if (addMiembroDto.image) {
            const result = await cloudinary.uploader.upload(addMiembroDto.image, { allowed_formats: ['jpg', 'png', 'gif', 'jpeg'] });
            image = result.url;
            picId = result.public_id;
        } else {
            if (genero === Generos.masculino) {
                image = 'https://res.cloudinary.com/dnfm4fq8d/image/upload/v1593455151/Male_Doctor_o5lkya.png';
                picId = 'Male_Doctor_o5lkya.png';
            } else {
                image = 'https://res.cloudinary.com/dnfm4fq8d/image/upload/v1593455138/Female_Doctor_pdtvtx.png';
                picId = 'Female_Doctor_pdtvtx.png';
            };

        };
        const miembro = await this.miembroModel.create({ apellido, nombre, especialidad, genero, mutualesAdheridas, photoURL: image, picId });
        return this.getMiembro(miembro._id)

    }

    async updateMiembro(id: string, addMiembroDto: AddMiembroDto): Promise<Miembro> {

        const miembro = await this.getMiembro(id);

        const { apellido, nombre, especialidad, genero, mutualesAdheridas } = addMiembroDto;

        if (genero !== miembro.genero && isNullOrUndefined(addMiembroDto.image) && (miembro.picId === 'Male_Doctor_o5lkya.png' || miembro.picId === 'Female_Doctor_pdtvtx.png')) {
            if (miembro.picId === 'Male_Doctor_o5lkya.png') {
                miembro.picId = 'Female_Doctor_pdtvtx.png';
                miembro.photoURL = 'https://res.cloudinary.com/dnfm4fq8d/image/upload/v1593455138/Female_Doctor_pdtvtx.png';
            } else {
                miembro.picId = 'Male_Doctor_o5lkya.png';
                miembro.photoURL = 'https://res.cloudinary.com/dnfm4fq8d/image/upload/v1593455151/Male_Doctor_o5lkya.png'
            }
        }

        miembro.apellido = apellido;
        miembro.nombre = nombre;
        miembro.especialidad = especialidad;
        miembro.genero = genero;
        miembro.mutualesAdheridas = mutualesAdheridas;

        if (addMiembroDto.image) {
            const currentPicId = miembro.picId.slice();

            const result = await cloudinary.uploader.upload(addMiembroDto.image, { allowed_formats: ['jpg', 'png', 'gif', 'jpeg'] });
            miembro.photoURL = result.url;
            miembro.picId = result.public_id;

            await miembro.save();

            if (currentPicId !== 'Male_Doctor_o5lkya.png' && currentPicId !== 'Female_Doctor_pdtvtx.png') {
                await cloudinary.uploader.destroy(currentPicId);
            };

            return this.getMiembro(miembro._id);
        };

        await miembro.save();
        return this.getMiembro(miembro._id);

    }

    async deleteMiembro(id: string): Promise<Miembro> {

        await this.getMiembro(id);
        return await this.miembroModel.findByIdAndDelete(id);

    }

}

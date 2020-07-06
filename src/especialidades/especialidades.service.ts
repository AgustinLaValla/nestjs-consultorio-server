import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Especialidad } from './interfaces/especialidad.interface';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { Servicio } from './interfaces/servicio.interface';

@Injectable()
export class EspecialidadesService {
    constructor(
        @InjectModel('Especialidad') private especialidadModel: Model<Especialidad>,
        @InjectModel('Servicio') private servicoModel: Model<Servicio>
    ) { }


    async getEspecialidades(): Promise<Especialidad[]> {
        return await this.especialidadModel.find().populate('servicios');
    }

    async getEspecialidad(id: string): Promise<Especialidad> {

        const especialidad = await this.especialidadModel.findById(id).populate('servicios');
        if (!especialidad) throw new NotFoundException('Especialidad Not Found');
        return especialidad;

    }

    async createEspecialidad(createEspecialidadDto: CreateEspecialidadDto) {
        const exists = await this.especialidadModel.findOne({ nombreEspecialidad: createEspecialidadDto.nombreEspecialidad });
        if (exists) throw new UnprocessableEntityException(`La especialidad ${exists.nombreEspecialidad} ya existe`);
        return await this.especialidadModel.create({ ...createEspecialidadDto });
    }

    async deleteEspecialidad(id: string) {
        await this.getEspecialidad(id);
        const especialidad = await this.especialidadModel.findByIdAndDelete(id);
        especialidad.servicios.map(async servicio => await this.deleteServicio(especialidad._id, servicio._id));
        return especialidad;
    }

    async createServicio(id: string, createServicioDto: CreateServicioDto): Promise<Servicio> {

        const { servicioName, especialidadId } = createServicioDto;

        const exists = await this.servicoModel.findOne({ nombre: servicioName });
        console.log(exists);
        if (exists) {
            await this.checkIfServicioExists(servicioName, especialidadId);
        };

        const servicio = await this.servicoModel.create({ nombre: servicioName });

        await this.especialidadModel.updateOne({ _id: id }, {
            $push: {
                servicios: servicio._id
            }
        }).where('servicios.nombre').ne(servicioName);

        return servicio;
    }

    async updateServicio(id: string, updateServicioDto: UpdateServiceDto): Promise<Servicio> {

        const { servicioId, newValue, especialidadId } = updateServicioDto;

        const exists = await this.servicoModel.findOne({ nombre: newValue });

        if (exists) {
            await this.checkIfServicioExists(newValue, especialidadId);
        }

        const servicio = await this.servicoModel.findByIdAndUpdate(servicioId, { nombre: newValue }, { new: true });

        return servicio;
    }

    async deleteServicio(id: string, servicioId: string) {
        await this.servicoModel.findByIdAndDelete(servicioId);
        await this.especialidadModel.update({ _id: id }, {
            $pull: {
                servicios: servicioId
            }
        });

    }

    async checkIfServicioExists(servicioName: string, especialidadId: string) {
        const especialidad = await this.especialidadModel.findById(especialidadId).populate('servicios');
        console.log(especialidad);
        const servicioIsIncluded = especialidad.servicios.some(servicio => servicio.nombre === servicioName);
        if (servicioIsIncluded) throw new UnprocessableEntityException(`El servicio: ${servicioName} ya existe en la especialidad: ${especialidad.nombreEspecialidad}`);
    };
}

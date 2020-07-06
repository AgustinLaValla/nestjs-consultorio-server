import { Injectable, NotFoundException, UnprocessableEntityException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pacient } from './interfaces/pacient.interface';
import { Turno } from 'src/turnos/interfaces/turno.interface';
import { UpdatePacientDto } from './dto/update-pacient.dto';
import { TurnosService } from 'src/turnos/turnos.service';

@Injectable()
export class PacientsService {
    constructor(
        @InjectModel('Pacient') private pacientModel: Model<Pacient>,
        @Inject(forwardRef(() => TurnosService)) private turnosService: TurnosService
    ) { }

    async getPacients(count: number): Promise<Pacient[]> {
        const pacients = await this.pacientModel.find().limit(count).sort({ apellido: 'asc' }).populate('obraSocial').populate({
            path: 'turnos',
            populate: {
                path: 'especialistaId',
                select: 'nombre apellido',
            },
        }).populate({
            path: 'turnos',
            populate: {
                path: 'consulta'
            }
        }).populate({
            path: 'turnos',
            populate: {
                path: 'obraSocial'
            }
        });
        return pacients;
    }

    async getPacientByDni(dni: string): Promise<Pacient> {
        return await this.pacientModel.findOne({ dni: dni }).populate('obraSocial').populate({
            path: 'turnos',
            populate: {
                path: 'especialistaId',
                select: 'nombre apellido',
            },
        }).populate({
            path: 'turnos',
            populate: {
                path: 'consulta'
            }
        }).populate({
            path: 'turnos',
            populate: {
                path: 'obraSocial'
            }
        });;
    }

    async getPacientCounter(): Promise<Number> {
        return await this.pacientModel.estimatedDocumentCount();
    }

    async getSinglePacient(id: string) {
        const pacient = await this.pacientModel.findById(id).populate('obraSocial').populate({
            path: 'turnos',
            populate: {
                path: 'especialistaId',
                select: 'nombre apellido',
            },
        }).populate({
            path: 'turnos',
            populate: {
                path: 'consulta'
            }
        }).populate({
            path: 'turnos',
            populate: {
                path: 'obraSocial'
            }
        });

        if (!pacient) throw new NotFoundException(`Pacient not Found`);
        return pacient;
    }

    async getPacientByName(value: string) {
        const regex = new RegExp(value, 'i');
        return this.pacientModel.find().or([
            { nombre: regex },
            { apellido: regex }
        ]).populate('obraSocial').populate({
            path: 'turnos',
            populate: {
                path: 'especialistaId',
                select: 'nombre apellido',
            }
        }).populate({
            path: 'turnos',
            populate: {
                path: 'consulta'
            }
        }).populate({
            path: 'turnos',
            populate: {
                path: 'obraSocial'
            }
        });
    }

    async createPacient(pacient: Partial<Pacient>): Promise<Pacient> {
        const exists = await this.getPacientByDni(pacient.dni)
        if (!exists) {
            const { nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds } = pacient;
            const newPacient = await this.pacientModel.create({ nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds });
            return newPacient;
        }
        return exists;
    }

    async addTurno(pacientId: string, turnoId: string): Promise<void> {
        await this.pacientModel.updateOne({ _id: pacientId }, {
            $push: {
                turnos: turnoId
            }
        });
    }

    async updatePacient(updatePacientDto: UpdatePacientDto): Promise<Pacient> {

        const oldData = await this.pacientModel.findById(updatePacientDto._id);

        if (oldData.dni !== updatePacientDto.dni && oldData._id !== updatePacientDto._id) {
            const exist = await this.getPacientByDni(updatePacientDto.dni);
            if (exist) throw new UnprocessableEntityException(`Ya existe un paciente con ese dni: ${exist.nombre} ${exist.apellido}`);
        };
        
        if (oldData.dni !== updatePacientDto.dni && oldData._id.toString() === updatePacientDto._id) {
            await this.turnosService.updatePacientTurnosCollection(oldData.dni, updatePacientDto.dni);
        };


        const pacientUpdated = await this.pacientModel.findByIdAndUpdate(updatePacientDto._id, { ...updatePacientDto }, { new: true }).populate('obraSocial').populate({
            path: 'turnos',
            populate: {
                path: 'especialistaId',
                select: 'nombre apellido',
            },
        }).populate({
            path: 'turnos',
            populate: {
                path: 'consulta'
            }
        }).populate({
            path: 'turnos',
            populate: {
                path: 'obraSocial'
            }
        });

        return pacientUpdated;
    }

    async comparePacientAndUpdate(pacient: Partial<Pacient>) {
        const queriedPacient = await this.getPacientByDni(pacient.dni);

        if (queriedPacient) {
            if (pacient.apellido !== queriedPacient.apellido || pacient.nombre !== queriedPacient.nombre ||
                pacient.dni !== queriedPacient.dni || pacient.obraSocial !== queriedPacient.obraSocial ||
                pacient.nacimiento !== queriedPacient.nacimiento || pacient.nacimientoSeconds !== queriedPacient.nacimientoSeconds ||
                pacient.telefono !== queriedPacient.telefono || pacient.numeroDeAfiliado !== queriedPacient.numeroDeAfiliado
            ) {

                const { nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds } = pacient;
                await this.updatePacient({ nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds, _id: queriedPacient._id } as UpdatePacientDto)
            };
        };

        return;
    }

    async deleteTurno(turno: Partial<Turno>): Promise<void> {
        const pacient = await this.getPacientByDni(turno.dni);
        if (pacient) {
            await this.pacientModel.updateOne({ _id: pacient._id }, {
                $pull: {
                    turnos: turno._id
                }
            })
        }
    }

    async deletePacient(id: string): Promise<Pacient> {
        await this.getSinglePacient(id);
        return await this.pacientModel.findByIdAndDelete(id);
    }

}

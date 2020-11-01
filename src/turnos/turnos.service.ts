import { Injectable, UnprocessableEntityException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Turno } from 'src/turnos/interfaces/turno.interface';
import * as moment from 'moment/moment';
import { AddTurnoDto } from './dto/add-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PacientsService } from 'src/pacients/pacients.service';

@Injectable()
export class TurnosService {

    private currentDate = moment().startOf('day').unix();

    constructor(
        @InjectModel('Turno') private turnoModel: Model<Turno>,
        @Inject(forwardRef(() => PacientsService)) private pacientsService: PacientsService,
    ) { }

    async getMiembroTurnos(especialistaId: string, count: number): Promise<Turno[]> {

        const turnos = await this.turnoModel.find().and([
            { 'especialistaId': { $eq: especialistaId } },
            { 'dateInSeconds': { $gte: this.currentDate } }
        ]).limit(count).sort({ dateInSeconds: 1 }).populate('obraSocial').populate('consulta').populate('especialistaId', 'nombre apellido');

        return turnos;
    }

    async getSingleTurno(turnoId: string): Promise<Turno> {
        const turno = await this.turnoModel.findById(turnoId).populate('obraSocial').populate('consulta').populate('especialistaId', 'nombre apellido');
        if (!turno) throw new BadRequestException(`Turno Not Found`);
        return turno;
    }

    async getTurnosCounterValue(especialistaId: string): Promise<Number> {
        return await this.turnoModel.countDocuments({ especialistaId });
    }

    async getOldTurnos(especialistaId: string, count: number = 15): Promise<Turno[]> {
        const turnos = await this.turnoModel.find().and([
            { 'especialistaId': { $eq: especialistaId } },
            { 'dateInSeconds': { $lt: this.currentDate } }
        ]).limit(count).sort({ dateInSeconds: -1 }).populate('obraSocial').populate('consulta').populate('especialistaId', 'nombre apellido');

        return turnos;
    }

    async getTurnosFromTo(especialistaId: string, from: number, to: number): Promise<Turno[]> {
        const turnos = await this.turnoModel.find().and([
            { 'especialistaId': { $eq: especialistaId } },
            { 'dateInSeconds': { $gte: from } },
            { 'dateInSeconds': { $lt: to } }
        ]).sort({ dateInSeconds: 1 }).populate('consulta').populate('obraSocial').populate('especialistaId', 'nombre apellido');

        return turnos;
    }

    async getTurnosConcretadosLength(especialistaId: string): Promise<number> {
        const counter = await this.turnoModel.countDocuments().and([
            { 'especialistaId': { $eq: especialistaId } },
            { 'dateInSeconds': { $lt: this.currentDate } }
        ]);

        return counter;
    }

    async getTurnoByPacientLastName(especialistaId: string, value: string): Promise<Turno[]> {
        const regex = new RegExp(value, 'i');
        const turnos = await this.turnoModel.find().and([
            { 'especialistaId': { $eq: especialistaId } },
            {
                $or: [
                    { 'nombre': regex },
                    { 'apellido': regex }
                ]
            }
        ]).populate('obraSocial').populate('consulta').populate('especialistaId', 'nombre apellido');
        return turnos;
    }

    async addTurno(addTurnoDto: AddTurnoDto): Promise<Turno> {

        const { especialistaId, dateInSeconds } = addTurnoDto

        const exists = await this.turnoModel.findOne().and([
            { 'especialistaId': { $eq: especialistaId } },
            { 'dateInSeconds': { $eq: dateInSeconds } }
        ]);

        if (!exists) {

            const { nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds } = addTurnoDto;
            const pacient = await this.pacientsService.createPacient({ nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds });

            const newTurno = await this.turnoModel.create({ ...addTurnoDto });

            await this.pacientsService.addTurno(pacient._id, newTurno._id);

            return await this.turnoModel.findById(newTurno._id).populate('especialistaId', 'nombre apellido').populate('obraSocial').populate('consulta')
        } else {
            const turnoTime: moment.Moment = moment(exists.desde);
            throw new UnprocessableEntityException({
                message: 'Este turno está ocupado',
                details: `${exists.nombre} ${exists.apellido}: ${turnoTime.utc().format('YYYY-MM-DD LT')}`
            });
        };

    }

    async updateTurno(updateTurnoDto: UpdateTurnoDto): Promise<Turno> {

        const { especialistaId, dateInSeconds, _id } = updateTurnoDto;

        const exists = await this.turnoModel.findOne().and([
            { 'especialistaId': { $eq: especialistaId } },
            { 'dateInSeconds': { $eq: dateInSeconds } }
        ]);

        if (!exists) {
            const turno = await this.turnoModel.findByIdAndUpdate(_id, { ...updateTurnoDto }, { new: true })
                .populate('obraSocial').populate('consulta').populate('especialistaId', 'nombre apellido');

            const { nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds } = updateTurnoDto;
            await this.pacientsService.comparePacientAndUpdate({ nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds });

            return turno;
        } else if (JSON.stringify(exists) != JSON.stringify(updateTurnoDto) && exists._id == updateTurnoDto._id) {
            const { nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds } = updateTurnoDto;
            await this.pacientsService.comparePacientAndUpdate({ nombre, apellido, obraSocial, numeroDeAfiliado, dni, telefono, nacimiento, nacimientoSeconds });
            return await this.turnoModel.findByIdAndUpdate(_id, { ...updateTurnoDto }, { new: true })
                .populate('obraSocial').populate('consulta').populate('especialistaId', 'nombre apellido');
        } else if (JSON.stringify(exists) != JSON.stringify(updateTurnoDto)
            && exists.dateInSeconds === updateTurnoDto.dateInSeconds) {
            const turnoTime: moment.Moment = moment(exists.desde);
            throw new UnprocessableEntityException({
                message: 'Este turno está ocupado',
                details: `${exists.nombre} ${exists.apellido}: ${turnoTime.utc().format('YYYY-MM-DD LT')}`
            });
        };

    }

    async updatePacientTurnosCollection(oldDni: string, dni: string) {
        console.log({ oldDni, dni })
        await this.turnoModel.updateMany({ dni: oldDni }, { dni: dni });
    }

    async deleteTurno(turnoId: string): Promise<Turno> {
        await this.getSingleTurno(turnoId);
        const turno = await this.turnoModel.findByIdAndDelete(turnoId);
        await this.pacientsService.deleteTurno(turno);
        return turno;
    }

}

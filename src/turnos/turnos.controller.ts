import { Controller, ValidationPipe, Body, Res, Post, Param, ParseIntPipe, Get, Put, Delete } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { AddTurnoDto } from './dto/add-turno.dto';
import { Response } from 'express';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Controller('turnos')
export class TurnosController {
    constructor(private turnosService: TurnosService) { }

    @Get('/turnos-counter/:especialistaId')
    async getTurnosCounter(@Param('especialistaId') especialistaId: string, @Res() res: Response): Promise<Response> {
        const counter = await this.turnosService.getTurnosCounterValue(especialistaId);
        return res.json({ ok: true, counter });
    }

    @Get('/turnos-concretados-counter/:especialistaId')
    async getTurnosConcretadosLenght(
        @Param('especialistaId') especialistaId: string,
        @Res() res: Response
    ): Promise<Response> {
        const counter = await this.turnosService.getTurnosConcretadosLength(especialistaId);
        return res.json({ ok: true, counter });
    }

    @Get('get-turno/:turnoId')
    async getSingleTurno(
        @Param('turnoId') turnoId:string,
        @Res() res:Response
    ): Promise<Response> {
        const turno = await this.turnosService.getSingleTurno(turnoId);
        return res.json({ok:true, turno});
    }

    @Get('/search/:especialistaId/:value')
    async getTurnosByPacientLastname(
        @Param('value') value:string,
        @Param('especialistaId') especialistaId:string,
        @Res() res:Response
    ): Promise<Response> {
        const turnos = await this.turnosService.getTurnoByPacientLastName(especialistaId ,value);
        return res.json({ok:true, turnos});
    };

    @Get('get-turnos/:especialistaId/:count')
    async getMiembroTurnos(
        @Param('especialistaId') especialistaId: string,
        @Param('count', ParseIntPipe) count: number,
        @Res() res: Response
    ) {
        const turnos = await this.turnosService.getMiembroTurnos(especialistaId, count);
        return res.json({ ok: true, turnos });
    }

    @Get('/old-turnos/:especialistaId/:count')
    async getOldTurnos(
        @Param('especialistaId') especialistaId: string,
        @Param('count', ParseIntPipe) count: number,
        @Res() res: Response
    ): Promise<Response> {
        const turnos = await this.turnosService.getOldTurnos(especialistaId, count);
        return res.json({ ok: true, turnos });
    }

    @Get('from-to/:especialistaId/:from/:to')
    async getFromTo(
        @Param('especialistaId') especialistaId: string,
        @Param('from', ParseIntPipe) from: number,
        @Param('to', ParseIntPipe) to: number,
        @Res() res: Response
    ) {
        const turnos = await this.turnosService.getTurnosFromTo(especialistaId, from, to);
        return res.json({ ok: true, turnos });
    }


    @Post('/add-turno')
    async addTurno(@Body(ValidationPipe) addTurnoDto: AddTurnoDto, @Res() res: Response): Promise<Response> {
        const turno = await this.turnosService.addTurno(addTurnoDto);
        return res.json({ ok: true, message: 'Turno Successfully Added', turno });
    }

    @Put('/update-turno')
    async updateTurno(@Body(ValidationPipe) updateTurnoDto: UpdateTurnoDto, @Res() res: Response): Promise<Response> {
        const turno = await this.turnosService.updateTurno(updateTurnoDto);
        return res.json({ ok: true, message: 'Turno Successfully Updated', turno });
    }

    @Delete('/:id')
    async deleteTurno(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const turno = await this.turnosService.deleteTurno(id);
        return res.json({ ok: true, message: 'Turno Successfully Deleted', turno });
    }
}

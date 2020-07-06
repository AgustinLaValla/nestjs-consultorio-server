import { Controller, Body, ValidationPipe, Res, Post, Get, Param, Delete, Put } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { Response } from 'express';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServiceDto } from './dto/update-service.dto';


@Controller('especialidades')
export class EspecialidadesController {
    constructor(private especialidadesService: EspecialidadesService) { }

    @Get()
    async getEspecialidades(@Res() res: Response): Promise<Response> {
        const especialidades = await this.especialidadesService.getEspecialidades();
        return res.json({ ok: true, especialidades });
    }

    @Get('/:id')
    async getEspecialidad(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const especialidad = await this.especialidadesService.getEspecialidad(id);
        return res.json({ ok: true, especialidad });
    }

    @Post('/create')
    async createEspecialidad(
        @Body(ValidationPipe) createEspecialidadDto: CreateEspecialidadDto,
        @Res() res: Response
    ): Promise<Response> {
        const especialidad = await this.especialidadesService.createEspecialidad(createEspecialidadDto);
        return res.json({ ok: true, message: 'Especialidad Successfully created', especialidad });
    }

    @Put('/create-servicio/:id')
    async createServicio(
        @Param('id') id: string,
        @Body() createServiceDto: CreateServicioDto,
        @Res() res: Response
    ): Promise<Response> {
        const servicio = await this.especialidadesService.createServicio(id, createServiceDto);
        return res.json({ ok: true, message: 'Servicio SuccessFully created', servicio });
    }

    @Put('/update-servicio/:id')
    async updateServicio(
        @Param('id') id: string,
        @Body(ValidationPipe) updateServicioDto: UpdateServiceDto,
        @Res() res: Response
    ): Promise<Response> {
        const servicio = await this.especialidadesService.updateServicio(id, updateServicioDto);
        return res.json({ ok: true, message: 'Servicio Successfully Updated', servicio});
    }

    @Delete('/delete/:id')
    async deleteEspecialidad(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const especialidad = await this.especialidadesService.deleteEspecialidad(id);
        return res.json({ ok: false, especialidad });
    }

    @Delete('/delete-servicio/:id/:servicioId')
    async deleteServicio(
        @Param('id') id: string,
        @Param('servicioId') servicioId: string,
        @Res() res: Response
    ): Promise<Response> {
        await this.especialidadesService.deleteServicio(id, servicioId);
        return res.json({ ok: true, message:'Servicio Successfully deleted' });
    }


}

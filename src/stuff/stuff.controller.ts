import { Controller, ValidationPipe, Body, Res, Post, Get, Param, Delete, Put } from '@nestjs/common';
import { StuffService } from './stuff.service';
import { AddMiembroDto } from './dto/add-miembro.dto';
import { Response } from 'express';

@Controller('stuff')
export class StuffController {
    constructor(private stuffService: StuffService) { }

    @Get()
    async getStuff(@Res() res: Response): Promise<Response> {
        const stuff = await this.stuffService.getStuff();
        return res.json({ ok: true, stuff });
    }

    @Get('/:id')
    async getMiembro(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const miembro = await this.stuffService.getMiembro(id);
        return res.json({ ok: true, miembro });
    }

    @Post('/add-miembro')
    async addMiembro(
        @Body(ValidationPipe) createMiembroDto: AddMiembroDto,
        @Res() res: Response
    ): Promise<Response> {
        const miembro = await this.stuffService.addMiembro(createMiembroDto);
        return res.json({ ok: true, message: 'Miembro Successfully Added', miembro });
    };

    @Put('/update/:id')
    async updateMiembro(
        @Param('id') id: string,
        @Body(ValidationPipe) addMiembroDto: AddMiembroDto,
        @Res() res: Response
    ): Promise<Response> {
        const miembro = await this.stuffService.updateMiembro(id, addMiembroDto);
        return res.json({ ok: true, message: 'Miembro Successfully updated', miembro });
    }

    @Delete('/:id')
    async deleteMiembro(
        @Param('id') id: string,
        @Res() res: Response
    ): Promise<Response> {
        const miembro = await this.stuffService.deleteMiembro(id);
        return res.json({ ok: true, miembro });
    }
}

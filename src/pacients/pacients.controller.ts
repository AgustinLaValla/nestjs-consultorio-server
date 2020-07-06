import { Controller, Res, Get, Param, Put, Body, ValidationPipe, Delete, ParseIntPipe } from '@nestjs/common';
import { PacientsService } from './pacients.service';
import { Response } from 'express';
import { UpdatePacientDto } from './dto/update-pacient.dto';

@Controller('pacients')
export class PacientsController {

    constructor(private pacientsService: PacientsService) { }

    @Get('/counter')
    async getPacientsCounter(@Res() res: Response): Promise<Response> {
        const counter = await this.pacientsService.getPacientCounter();
        return res.json({ ok: true, counter });
    }

    @Get('/get-pacients/:counter')
    async getPacients(
        @Param('counter', ParseIntPipe) counter: number,
        @Res() res: Response
    ): Promise<Response> {
        const pacients = await this.pacientsService.getPacients(counter);
        return res.json({ ok: true, pacients });
    }

    @Get('/get-pacient/:id')
    async getPacient(
        @Param('id') id: string,
        @Res() res: Response
    ): Promise<Response> {
        const pacient = await this.pacientsService.getSinglePacient(id);
        return res.json({ ok: true, pacient });
    }

    @Get('/search/:value')
    async getPacientByName(
        @Param('value') value: string,
        @Res() res: Response
    ): Promise<Response> {
        const pacients = await this.pacientsService.getPacientByName(value);
        return res.json({ ok: true, pacient: pacients })
    }

    @Get('/get-pacient-by-dni/:dni')
    async getPacientByDni(
        @Param('dni') dni: string,
        @Res() res: Response
    ): Promise<Response> {
        const pacient = await this.pacientsService.getPacientByDni(dni);
        return res.json({ ok: true, pacient });
    }

    @Put('/update')
    async updatePacient(
        @Body(ValidationPipe) updatePacientDto: UpdatePacientDto,
        @Res() res: Response
    ) {
        const pacient = await this.pacientsService.updatePacient(updatePacientDto);
        return res.json({ ok: true, message: 'Pacient Successfully Updated', pacient });
    }

    @Delete('/:id')
    async deletePacient(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        const pacient = await this.pacientsService.deletePacient(id);
        return res.json({ ok: true, message: 'Pacient Successfully Deleted', pacient });
    }

}

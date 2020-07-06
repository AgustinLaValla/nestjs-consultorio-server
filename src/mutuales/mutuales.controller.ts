import { Controller, Body, ValidationPipe, Res, Post, Param, Get, Put, Delete, UseFilters } from '@nestjs/common';
import { MutualesService } from './mutuales.service';
import { CreateMutualDto } from './dto/create-mutual.dto';
import { Response } from 'express';

@Controller('mutuales')

export class MutualesController {
    constructor(private mutualesService: MutualesService) { }

    @Get()
    async getMutuales(@Res() res: Response): Promise<Response> {
        const mutuales = await this.mutualesService.getMutuales();
        return res.json({ ok: true, mutuales });
    }

    @Get('/:id')
    async getMutual(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const mutual = await this.mutualesService.getMutual(id);
        return res.json({ ok: true, mutual });
    }

    @Post('/create')
    async createMutual(@Body(ValidationPipe) createMutualDto: CreateMutualDto, @Res() res: Response): Promise<Response> {
        const mutual = await this.mutualesService.createMutual(createMutualDto);
        return res.json({ ok: true, message: 'Mutual Successfully created', mutual });
    }

    @Put('/update/:id')
    async updateMutual(
        @Param('id') id: string,
        @Body(ValidationPipe) createMutualDto: CreateMutualDto,
        @Res() res: Response
    ): Promise<Response> {
        const mutual = await this.mutualesService.updateMutual(id, createMutualDto);
        return res.json({ok:true, message:'Mutual Successfully updated', mutual});
    }

    @Delete('/delete/:id')
    async deleteMutual(@Param('id') id:string, @Res() res:Response):Promise<Response> {
        await this.mutualesService.deleteMutual(id);
        return res.json({ok:true, message:'Mutual Successfully Deleted'});
    }
}

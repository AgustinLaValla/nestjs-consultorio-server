import { Module, forwardRef } from '@nestjs/common';
import { PacientsService } from './pacients.service';
import { PacientsController } from './pacients.controller';
import { MutualesModule } from 'src/mutuales/mutuales.module';
import { MongooseModule } from '@nestjs/mongoose';
import { pacientSchema } from './schemas/pacient.schema';
import { StuffModule } from 'src/stuff/stuff.module';
import { TurnosModule } from 'src/turnos/turnos.module';

@Module({
  providers: [PacientsService],
  controllers: [PacientsController],
  imports:[
    MongooseModule.forFeature([{name:'Pacient', schema:pacientSchema}]),
    MutualesModule,
    forwardRef(() => TurnosModule),
    StuffModule,
  ],
  exports: [
    MongooseModule,
    PacientsService
  ]
})
export class PacientsModule {}

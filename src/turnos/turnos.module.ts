import { Module, forwardRef } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { turnoSchema } from './schemas/turno.schema';
import { StuffModule } from 'src/stuff/stuff.module';
import { MutualesModule } from 'src/mutuales/mutuales.module';
import { PacientsModule } from 'src/pacients/pacients.module';
import { EspecialidadesModule } from 'src/especialidades/especialidades.module';

@Module({
  providers: [TurnosService],
  controllers: [TurnosController],
  imports: [
    MongooseModule.forFeature([{name:'Turno', schema:turnoSchema}]),
    StuffModule,
    MutualesModule,
    forwardRef(() => PacientsModule),
    EspecialidadesModule
  ],
  exports:[TurnosService]
})
export class TurnosModule {}

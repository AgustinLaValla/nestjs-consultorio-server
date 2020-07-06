import { Module } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { EspecialidadesController } from './especialidades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { especialidadSchema } from './schemas/especialidad.schema';
import { servicioSchema } from './schemas/servicio.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Especialidad', schema: especialidadSchema },
    { name: 'Servicio', schema: servicioSchema }
  ])],
  providers: [EspecialidadesService],
  controllers: [EspecialidadesController],
  exports: [MongooseModule]
})
export class EspecialidadesModule { }

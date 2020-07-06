import { Module } from '@nestjs/common';
import { StuffService } from './stuff.service';
import { StuffController } from './stuff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { miembroSchema } from './schemas/miembro.schema';
import { MutualesModule } from 'src/mutuales/mutuales.module';
import { EspecialidadesModule } from 'src/especialidades/especialidades.module';

@Module({
  imports: [MongooseModule.forFeature([{name:'Miembro', schema:miembroSchema}]), MutualesModule, EspecialidadesModule],
  providers: [StuffService],
  controllers: [StuffController],
  exports:[MongooseModule]
})
export class StuffModule {}

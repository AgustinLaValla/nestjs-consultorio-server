import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MutualesModule } from './mutuales/mutuales.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { StuffModule } from './stuff/stuff.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './global/global-exception.filter';
import { TurnosModule } from './turnos/turnos.module';
import { PacientsModule } from './pacients/pacients.module';
import { config } from 'dotenv';  

config();

const DB_URI = process.env.DB_URI;
// const DB_URI = 'mongodb://localhost/consultorio-ayacucho';

@Module({
  imports: [
    MutualesModule,
    MongooseModule.forRoot(DB_URI, {
      useUnifiedTopology:true,
      useCreateIndex:true,
      useFindAndModify:true
    }),
    EspecialidadesModule,
    StuffModule,
    TurnosModule,
    PacientsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {provide:APP_FILTER, useClass:GlobalExceptionFilter}
  ],
})
export class AppModule { }

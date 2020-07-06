/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { MutualesService } from './mutuales.service';
import { MutualesController } from './mutuales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { mutualSchema } from './schema/mutual.schema';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      name:'Mutual',
      useFactory: () => {
        const schema = mutualSchema;
        schema.plugin(require('mongoose-unique-validator'), {message:'{PATH} should be unique'});
        return schema;
      }
    }
  ])],
  exports:[MongooseModule],
  providers: [MutualesService],
  controllers: [MutualesController]
})
export class MutualesModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({limit:'50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  // app.enableCors({origin:true});
  app.use(cors());
  await app.listen(3000);
}
bootstrap();

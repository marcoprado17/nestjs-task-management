import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if(appConfig.server.enableCors) {
    app.enableCors();
  }

  const port = appConfig.server.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}

bootstrap();

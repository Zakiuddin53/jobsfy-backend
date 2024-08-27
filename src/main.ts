import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { apiReference } from '@scalar/nestjs-api-reference';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { BadRequestErrorFilter } from './exceptions-filters/bad-request-error.filter';

dotenv.config();

async function bootstrap() {
  const logLevels: LogLevel[] = ['log', 'error', 'warn', 'fatal'];

  if (process.env.NODE_ENV == 'DEBUG') {
    logLevels.push('debug', 'verbose');
  }

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new BadRequestErrorFilter());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('JOBSFY API')
    .setDescription('The APIs for jobsfy')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

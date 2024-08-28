import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { apiReference } from '@scalar/nestjs-api-reference';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { BadRequestErrorFilter } from './exceptions-filters/bad-request-error.filter';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './exceptions-filters/all-exceptions.filter';

dotenv.config();

async function bootstrap() {
  console.log('JWT Secret in main:', process.env.JWT_SECRET); // Add this log
  const logLevels: LogLevel[] = ['log', 'error', 'warn', 'fatal'];

  if (process.env.NODE_ENV === 'DEBUG') {
    logLevels.push('debug', 'verbose');
  }

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  const configService = app.get(ConfigService);

  const jwtSecret = configService.get<string>('JWT_SECRET');
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new BadRequestErrorFilter());
  app.useGlobalFilters(new AllExceptionsFilter());

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

  // Log successful database connection
  app.enableShutdownHooks();
  await app.init();
  console.log('Database connection has been established successfully.');

  await app.listen(process.env.PORT || 9000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});

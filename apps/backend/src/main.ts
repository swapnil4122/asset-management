import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // ---- CORS ----
  const origins = configService.get<string>('CORS_ORIGINS', 'http://localhost:5173');
  app.enableCors({
    origin: origins.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // ---- Global prefix and versioning ----
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ---- Pipes ----
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ---- Filters & Interceptors ----
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // ---- Swagger (dev only) ----
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Asset Management Platform API')
      .setDescription('Enterprise blockchain asset management REST API')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management')
      .addTag('Assets', 'Asset registration and management')
      .addTag('Marketplace', 'Listing and purchasing assets')
      .addTag('Verification', 'Asset verification workflow')
      .addTag('Blockchain', 'Blockchain integration')
      .addTag('Health', 'Health checks')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(port);

  Logger.log(`🚀 Asset Management API running on: http://localhost:${port}/api/v1`, 'Bootstrap');
  Logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap().catch((error: unknown) => {
  Logger.error('Failed to start application', error instanceof Error ? error.stack : error, 'Bootstrap');
  process.exit(1);
});

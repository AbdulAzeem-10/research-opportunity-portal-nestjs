import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;
  const frontendOrigin =
    configService.get<string>('FRONTEND_ORIGIN') || 'http://localhost:3000';

  // Configure CORS for frontend development origin
  app.enableCors({
    origin: frontendOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global /api prefix
  app.setGlobalPrefix('api');

  // Global exception filter for consistent 400/404/500 JSON error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe: rejects unknown fields and validates payloads
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  console.log(`🚀 Research Opportunity API running on: http://localhost:${port}/api`);
}
bootstrap();

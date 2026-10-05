import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: [
      process.env.ADMIN_ORIGIN || 'http://localhost:3001',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Developify API')
    .setDescription('Production API for Developify Mobile and Admin')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  try {
    writeFileSync(
      join(process.cwd(), 'openapi', 'openapi.json'),
      JSON.stringify(document, null, 2),
    );
  } catch {
    // optional write
  }

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Developify API listening on :${port}`);
}
bootstrap();

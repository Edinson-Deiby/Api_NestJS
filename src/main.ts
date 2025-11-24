import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  // Crear carpeta de uploads si no existe (desde raíz del proyecto)
  const uploadPath = join(process.cwd(), 'uploads');
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      // Opcional: whitelist: true, transform: true (buena práctica)
    }),
  );

  // Escuchar en todas las interfaces de red
  await app.listen(3000, '0.0.0.0'); // ← clave para acceso universal

  // Opcional: log útil en consola
  const url = await app.getUrl();
  console.log(`🚀 Servidor corriendo en: ${url}`);
  console.log(`📁 Carpeta de uploads: ${uploadPath}`);
}

bootstrap();
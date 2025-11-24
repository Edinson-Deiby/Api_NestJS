import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { configUploads } from './configUploads';
import { Rol } from 'src/roles/rol.entity';

// Usa process.cwd() para consistencia
// const UPLOADS_PATH = join(process.cwd(), 'uploads');

// Función para validar el tipo de archivo
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {

  if (!file.mimetype.match(/^(image\/(png|jpeg|jpg))$/)) {
    return cb(new Error('Solo se permiten imágenes (PNG, JPEG, JPG)'), false);
  }

  const allowedExtensions = ['.png', '.jpg', '.jpeg'];
  const ext = extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Extensión de archivo no permitida'), false);
  }

  cb(null, true);
};

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol]),
    MulterModule.register({
      dest: configUploads.UPLOADS_PATH,
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
      },
      fileFilter,
      storage: diskStorage({
        destination: configUploads.UPLOADS_PATH,
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: configUploads.UPLOADS_PATH,
      serveRoot: configUploads.SERVER_ROOT,
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController]
})
export class UsersModule { }

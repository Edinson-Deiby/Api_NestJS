import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Multer lanza errores de tipo `MulterError` o `Error` personalizado
import { MulterError } from 'multer';

@Catch(MulterError, Error)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let message = 'Archivo no válido';
    let statusCode = HttpStatus.BAD_REQUEST;

    // Si usaste `return cb(new Error('mi mensaje'), false)` en fileFilter
    if (exception instanceof Error && exception.message) {
      message = exception.message;      
    }
    // Si es un error interno de Multer (como "LIMIT_FILE_SIZE")
    else if (exception instanceof MulterError) {
      
      switch (exception.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'El archivo es demasiado grande';
          break;
        case 'LIMIT_FILE_COUNT':
          message = 'Demasiados archivos';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Archivo inesperado';
          break;
        default:
          message = 'Error al subir el archivo';
      }
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
    //   path: request.url,
      message,
    });
  }
}
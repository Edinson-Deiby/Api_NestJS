import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { configUploads } from './configUploads';
import { Request } from 'express';
import * as fs from 'fs'; 

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

    create(user: CreateUserDto) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    findAll() {
        return this.usersRepository.find({ relations: ['roles'] });
    }

    async update(id: number, user: UpdateUserDto) {
        const userFound = await this.usersRepository.findOneBy({ id: id });

        if (!userFound) {
            throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        }

        const updatedUser = Object.assign(userFound, user);
        return this.usersRepository.save(updatedUser);
    }


    async updateWithImage(file: Express.Multer.File, req: Request, id: number, user: UpdateUserDto) {

        const userFound = await this.usersRepository.findOneBy({ id: id });

        if (!userFound) {
            throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        }

        // Si el usuario tenía una imagen anterior, intentamos eliminarla
        if (userFound.image) {

            const oldImagePath = this.extractFilePath(userFound.image);
            if (oldImagePath && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Elimina el archivo físico
            }
        }

        if (file) {
            const domain = this.getCurrentDomain(req);
            let urlImg = domain + configUploads.SERVER_ROOT + "/" + file.filename;

            // Asignamos la nueva URL de imagen    
            user.image = urlImg;
        }

        const updatedUser = Object.assign(userFound, user);
        return this.usersRepository.save(updatedUser);
    }

    getCurrentDomain(req: Request): string {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('Host') || req.hostname;
        return `${protocol}://${host}`;
    }

    // Método para extraer solo el nombre del archivo de la URL completa
    private extractFilePath(fullUrl: string): string | null {
        try {
            const url = new URL(fullUrl);
            // Ajusta la ruta base según tu estructura de carpetas
            return `./uploads/${url.pathname.split('/').pop()}`; // Asume que las imágenes están en ./uploads/
        } catch (e) {
            // Si no es una URL válida, asume que es solo el nombre del archivo o la ruta relativa
            if (fullUrl.includes(configUploads.SERVER_ROOT)) {
                return fullUrl.replace(configUploads.SERVER_ROOT, './uploads');
            }
            return fullUrl.startsWith('/') ? `.${fullUrl}` : fullUrl;
        }
    }
}

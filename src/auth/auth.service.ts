import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Any, In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
        private jwtService: JwtService
    ) { }

    async register(user: RegisterAuthDto) {

        const emailExist = await this.usersRepository.findOneBy({ email: user.email });

        if (emailExist) {
            //409 CONFLIT
            throw new HttpException('El email ya esta registrado', HttpStatus.CONFLICT);
        }

        const phoneExist = await this.usersRepository.findOneBy({ phone: user.phone });

        if (phoneExist) {
            //409 CONFLIT
            throw new HttpException('El numero de telefono ya esta registrado', HttpStatus.CONFLICT);
        }

        const newUser = this.usersRepository.create(user);

        let rolesIds: any = [];

        if (user.rolesIds !== undefined && user.rolesIds !== null) {
            rolesIds = user.rolesIds;
        }
        else {
            rolesIds.push('CLIENT');
        }

        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });
        newUser.roles = roles;

        const savedUser = await this.usersRepository.save(newUser);
        const rolesString = savedUser.roles.map(rol => rol.id);

        const payload = { id: savedUser.id, name: savedUser.name, roles: rolesString }
        const token = this.jwtService.sign(payload);

        const { password: _, ...userWithoutPassword } = savedUser;

        const data = {
            user: userWithoutPassword,
            token: 'Bearer ' + token
        };

        return data;
    }

    async login(loginDto: LoginAuthDto) {

        const { email, password } = loginDto;
        const userFound = await this.usersRepository.findOne({
            where: { email: email },
            relations: ['roles']
        });

        if (!userFound) {

            throw new HttpException('El usuario no esta registrado', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await compare(password, userFound.password);

        if (!isPasswordValid) {

            throw new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN);
        }

        const rolesIds = userFound.roles.map(rol => rol.id);

        const payload = {
            id: userFound.id,
            name: userFound.name,
            roles: rolesIds
        };

        const token = this.jwtService.sign(payload);

        const { password: _, ...userWithoutPassword } = userFound;

        const data = {
            user: userWithoutPassword,
            token: 'Bearer ' + token
        };

        return data;
    }
}

import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { User } from 'src/users/user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports:[ TypeOrmModule.forFeature([Rol, User]) ],
  providers:[RolesService, JwtStrategy],
  controllers: [RolesController]
})
export class RolesModule {}

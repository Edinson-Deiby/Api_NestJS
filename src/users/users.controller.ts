import {
    Body, Controller, Post, Get, Put, UseGuards,
    Param, ParseIntPipe, UseInterceptors, UploadedFile, UseFilters,
    Req
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterExceptionFilter } from 'src/filters/multer-exception.filter';
import type { Request } from 'express';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';


@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)    
    @Put(':id')// http://192.168.1.2:3000/users/:id -> PUT  
    update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.usersService.update(id, user);
    }

    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('upload/:id') // http://192.168.1.2:3000/users/upload/id -> Post  
    @UseInterceptors(FileInterceptor('file'))
    @UseFilters(MulterExceptionFilter)
    async upload(@UploadedFile() file: Express.Multer.File,@Req() req: Request,@Param('id', ParseIntPipe) id:number,  @Body() user: UpdateUserDto) {
        
        return await this.usersService.updateWithImage(file,req, id, user);
    }
}

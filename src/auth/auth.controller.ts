import { Controller, Post, Body,Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    register(@Body() user:RegisterAuthDto ){
        return this.authService.register(user);
    }

    @Post('login')
    login(@Body() loginDto:LoginAuthDto ){
        return this.authService.login(loginDto);
    }
}

import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    notification_token?: string;

    // email:string;
    // password:string;
}
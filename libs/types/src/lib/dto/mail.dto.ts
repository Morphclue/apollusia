import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsString} from 'class-validator';

export class MailDto {
    @ApiProperty()
    @IsEmail()
    mail: string;

    @ApiProperty()
    @IsString()
    token: string;
}

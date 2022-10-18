import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class MailDto {
    @ApiProperty()
    @IsString()
    mail: string;

    @ApiProperty()
    @IsString()
    token: string;
}

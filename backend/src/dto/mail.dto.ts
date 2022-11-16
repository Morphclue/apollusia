import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class MailDto {
    @ApiProperty()
    @IsString()
    mail: string;

    @ApiProperty()
    @IsString()
    token: string;
}

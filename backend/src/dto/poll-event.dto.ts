import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class PollEvent {
    @ApiProperty()
    @IsString()
    _id: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    start: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    end: string;
}

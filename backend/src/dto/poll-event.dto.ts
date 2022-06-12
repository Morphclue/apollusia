import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class PollEvent {
    @ApiProperty()
    @IsNotEmpty()
    eventId: number;

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

import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class PollEventDto {
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

    @ApiProperty()
    @IsNumber()
    maxParticipants?: number;
}

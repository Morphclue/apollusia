import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MinLength} from 'class-validator';

import {PollEventDto} from './poll-event.dto';
import {Settings} from './settings';

export class PollDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsString()
    location?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    adminToken: string;

    @ApiProperty()
    @IsNotEmpty()
    settings: Settings;

    @ApiProperty()
    events?: PollEventDto[];

    @ApiProperty()
    bookedEvents?: string[];
}

import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MinLength} from 'class-validator';

import {PollEvent} from './poll-event.dto';
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
    @IsNotEmpty()
    @IsString()
    adminToken: string;

    @ApiProperty()
    @IsNotEmpty()
    settings: Settings;

    @ApiProperty()
    events?: PollEvent[];
}

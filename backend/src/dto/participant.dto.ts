import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MinLength} from 'class-validator';

import {PollEvent} from './poll-event.dto';

export class ParticipantDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    participation: PollEvent[];
}

import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MinLength} from 'class-validator';

import {PollEventDto} from './poll-event.dto';

export class ParticipantDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    participation: PollEventDto[];

    @ApiProperty()
    @IsNotEmpty()
    indeterminateParticipation: PollEventDto[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
}

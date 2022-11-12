import {ApiProperty} from '@nestjs/swagger';

export class StatisticsDto {
    @ApiProperty()
    polls: number;

    @ApiProperty()
    pollEvents: number;

    @ApiProperty()
    participants: number;

    @ApiProperty()
    users: number;
}

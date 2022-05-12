import {ApiProperty} from '@nestjs/swagger';

export class PollDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    deadline?: any;
}

import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, MinLength} from 'class-validator';

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
    deadline?: string;
}

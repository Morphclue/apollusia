import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class PushConfigDto {
  @ApiProperty()
  @IsString()
  vapidPublicKey: string;
}

import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsString} from 'class-validator';

export class ImprintDto {
  @ApiProperty()
  @IsString()
  contactOperator: string;

  @ApiProperty()
  @IsString()
  contactAddress: string;

  @ApiProperty()
  @IsEmail()
  contactMail: string;
}

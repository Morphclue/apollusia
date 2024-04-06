import {IsEmail} from 'class-validator';

export class Settings {
  @IsEmail()
  email: string;
}

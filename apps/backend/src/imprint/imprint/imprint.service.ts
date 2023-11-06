import {ImprintDto} from '@apollusia/types';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class ImprintService {
  constructor(private config: ConfigService) {
  }

  getImprint(): ImprintDto {
    return {
      contactOperator: this.config.get('CONTACT_OPERATOR'),
      contactAddress: this.config.get('CONTACT_ADDRESS'),
      contactMail: this.config.get('CONTACT_MAIL'),
    };
  }
}

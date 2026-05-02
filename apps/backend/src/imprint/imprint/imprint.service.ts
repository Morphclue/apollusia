import {ImprintDto} from '@apollusia/types';
import {Injectable} from '@nestjs/common';

import {environment} from '../../environment';

@Injectable()
export class ImprintService {
  getImprint(): ImprintDto {
    return {
      contactOperator: environment.contact.operator,
      contactAddress: environment.contact.address,
      contactMail: environment.contact.mail,
    };
  }
}

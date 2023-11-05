import {ImprintDto} from '@apollusia/types';
import {Controller, Get} from '@nestjs/common';

import {ImprintService} from './imprint.service';

@Controller('imprint')
export class ImprintController {
  constructor(private readonly imprintService: ImprintService) {
  }

  @Get('')
  async getImprint(): Promise<ImprintDto> {
    return this.imprintService.getImprint();
  }
}

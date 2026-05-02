import {Module} from '@nestjs/common';

import {ImprintController} from './imprint/imprint.controller';
import {ImprintService} from './imprint/imprint.service';

@Module({
  imports: [],
  providers: [ImprintService],
  controllers: [ImprintController],
})
export class ImprintModule {
}

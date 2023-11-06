import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {ImprintController} from './imprint/imprint.controller';
import {ImprintService} from './imprint/imprint.service';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [ImprintService],
  controllers: [ImprintController],
})
export class ImprintModule {
}

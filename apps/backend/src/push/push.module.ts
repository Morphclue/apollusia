import {Module} from '@nestjs/common';
import {KeycloakModule} from '../auth/keycloak.module';

import {PushController} from './push.controller';
import {PushService} from './push.service';

@Module({
  imports: [
    KeycloakModule,
  ],
  providers: [PushService],
  controllers: [PushController],
  exports: [PushService],
})
export class PushModule {
}

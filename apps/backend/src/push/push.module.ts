import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {PushController} from './push.controller';
import {PushService} from './push.service';
import {KeycloakModule} from '../auth/keycloak.module';

@Module({
  imports: [
    ConfigModule,
    KeycloakModule,
  ],
  providers: [PushService],
  controllers: [PushController],
  exports: [PushService],
})
export class PushModule {
}

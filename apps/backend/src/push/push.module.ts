import {Module} from '@nestjs/common';


import {PushController} from './push.controller';
import {PushService} from './push.service';
import {KeycloakModule} from '../auth/keycloak.module';

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

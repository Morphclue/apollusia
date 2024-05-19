import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import type {PushConfigDto} from '@apollusia/types';
import {firstValueFrom} from 'rxjs';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  #config: Promise<PushConfigDto>;

  constructor(
    private swPush: SwPush,
    http: HttpClient,
  ) {
    this.#config = firstValueFrom(http.get<PushConfigDto>(`${environment.backendURL}/push/config`));
  }

  async getPushToken(): Promise<PushSubscription> {
    const serverPublicKey = (await this.#config).vapidPublicKey;
    return this.swPush.requestSubscription({
      serverPublicKey,
    });
  }
}

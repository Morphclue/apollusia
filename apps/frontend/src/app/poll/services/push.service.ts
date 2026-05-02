import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import type {PushConfigDto} from '@apollusia/types';
import {firstValueFrom} from 'rxjs';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private swPush = inject(SwPush);
  http = inject(HttpClient);
  #config: Promise<PushConfigDto>;

  constructor() {
    this.#config = firstValueFrom(this.http.get<PushConfigDto>(`${environment.backendURL}/push/config`));
  }

  isEnabled() {
    return this.swPush.isEnabled;
  }

  async getSubscription(): Promise<PushSubscription | null> {
    return firstValueFrom(this.swPush.subscription);
  }

  async requestSubscription(): Promise<PushSubscription> {
    return this.swPush.requestSubscription({
      serverPublicKey: (await this.#config).vapidPublicKey,
    });
  }

  async unsubscribe() {
    return this.swPush.unsubscribe();
  }
}

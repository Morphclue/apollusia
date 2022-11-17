import {Injectable} from '@angular/core';
import {SsrCookieService} from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(
    private cookieService: SsrCookieService,
  ) {
  }

  get(key: string): string {
    return this.cookieService.get(key) || globalThis.localStorage?.getItem(key) || '';
  }

  set(key: string, value: string) {
    this.cookieService.set(key, value);
    globalThis.localStorage?.setItem(key, value);
  }
}

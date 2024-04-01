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

  getAll(prefix = ''): Record<string, string> {
    const result = this.cookieService.getAll();
    for (const key of Object.keys(result)) {
      if (!key.startsWith(prefix)) {
        delete result[key];
      }
    }

    if (globalThis.localStorage) {
      for (let index = 0; index < globalThis.localStorage.length; index++) {
        const key = globalThis.localStorage.key(index);
        if (key && key.startsWith(prefix)) {
          result[key] = globalThis.localStorage.getItem(key)!;
        }
      }
    }

    return result;
  }

  get(key: string): string {
    return this.cookieService.get(key) || globalThis.localStorage?.getItem(key) || '';
  }

  set(key: string, value: string) {
    this.cookieService.set(key, value);
    globalThis.localStorage?.setItem(key, value);
  }
}

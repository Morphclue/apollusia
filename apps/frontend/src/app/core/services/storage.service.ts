import {isPlatformBrowser} from '@angular/common';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {SsrCookieService} from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private cookieService = inject(SsrCookieService);

  getAll(prefix = ''): Record<string, string> {
    const result = this.cookieService.getAll();
    if (!this.isBrowser) return this.filterPrefix(result, prefix);
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

  delete(key: string) {
    this.cookieService.delete(key);
    globalThis.localStorage?.removeItem(key);
  }

  private filterPrefix(obj: Record<string, string>, prefix: string) {
    Object.keys(obj).forEach(k => !k.startsWith(prefix) && delete obj[k]);
    return obj;
  }
}

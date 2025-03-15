import {Injectable} from '@angular/core';

import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  constructor(
    private storageService: StorageService,
  ) {
  }

  getMail(): string | undefined {
    return this.storageService.get('mail') || undefined;
  }

  setMail(mail: string) {
    this.storageService.set('mail', mail);
  }
}

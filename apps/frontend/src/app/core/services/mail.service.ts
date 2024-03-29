import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {StorageService} from './storage.service';
import {TokenService} from './token.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private storageService: StorageService,
  ) {
  }

  getMail(): string | undefined {
    return this.storageService.get('mail') || undefined;
  }

  setMail(mail: string) {
    this.storageService.set('mail', mail);
    this.http.put(`${environment.backendURL}/poll/mail/participate`, {
      mail: mail,
      token: this.tokenService.getToken(),
    }).subscribe();
  }
}

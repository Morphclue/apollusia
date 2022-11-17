import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {environment} from '../../../environments/environment';
import {StorageService} from './storage.service';
import {TokenService} from './token.service';

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

  getMail(): string {
    return this.storageService.get('mail') || '';
  }

  setMail(mail: string) {
    this.storageService.set('mail', mail);
    this.http.put(`${environment.backendURL}/poll/mail/participate`, {
      mail: mail,
      token: this.tokenService.getToken(),
    }).subscribe();
  }
}

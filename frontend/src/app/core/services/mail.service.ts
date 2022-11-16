import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {environment} from '../../../environments/environment';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  getMail(): string | undefined {
    return localStorage.getItem('mail') || undefined;
  }

  setMail(mail: string) {
    localStorage.setItem('mail', mail);
    this.http.put(`${environment.backendURL}/poll/mail/participate`, {
      mail: mail,
      token: this.tokenService.getToken(),
    }).subscribe();
  }
}

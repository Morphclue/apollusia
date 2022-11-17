import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SsrCookieService} from 'ngx-cookie-service-ssr';

import {environment} from '../../../environments/environment';
import {Token} from '../../model';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private currentToken: string = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {
  }

  getToken(): string {
    this.currentToken = this.storageService.get('token') || '';
    if (this.currentToken.length === 0) {
      this.generateToken();
    }
    return this.currentToken;
  }

  async regenerateToken() {
    await this.http.get<Token>(`${environment.backendURL}/token/${this.currentToken}`).toPromise().then((data: Token) => {
      this.setToken(data.token);
    });
  }

  setToken(token: string) {
    this.storageService.set('token', token);
    this.currentToken = token;
  }

  private generateToken() {
    this.http.get<Token>(`${environment.backendURL}/token`).subscribe((data: Token) => {
      this.setToken(data.token);
    });
  }
}

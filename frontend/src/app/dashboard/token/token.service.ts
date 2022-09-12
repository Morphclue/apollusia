import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {Token} from '../../model/token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private currentToken: string = '';

  constructor(
    private http: HttpClient,
  ) {
  }

  getToken(): string {
    this.currentToken = localStorage.getItem('token') || '';
    if (this.currentToken.length === 0) {
      // FIXME: add await - otherwise the token is not set in time
      this.generateToken();
    }
    return this.currentToken;
  }

  private generateToken() {
    this.http.get<Token>(`${environment.backendURL}/token`).subscribe((data: Token) => {
      localStorage.setItem('token', data.token);
      this.currentToken = data.token;
    });
  }
}

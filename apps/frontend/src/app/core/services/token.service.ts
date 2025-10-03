import {HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import * as uuid from 'uuid';

import {StorageService} from './storage.service';
import {environment} from '../../../environments/environment';
import {Token} from '../../model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private http =inject(HttpClient);
  private storageService =inject(StorageService);
  private currentToken: string = '';

  getToken(): string {
    if (this.currentToken) {
      return this.currentToken;
    }
    const stored = this.storageService.get('token');
    if (stored) {
      this.currentToken = stored;
      return stored;
    }
    const newToken = uuid.v4();
    this.setToken(newToken);
    return newToken;
  }

  regenerateToken(): Observable<string> {
    return this.http.get<Token>(`${environment.backendURL}/token/${this.currentToken}`).pipe(
      map(data => data.token),
      tap(token => this.setToken(token)),
    );
  }

  setToken(token: string) {
    this.storageService.set('token', token);
    this.currentToken = token;
  }
}

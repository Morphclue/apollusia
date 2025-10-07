import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {TokenService} from '../services';

@Injectable()
export class ParticipantTokenInterceptor implements HttpInterceptor {
  private tokenService = inject(TokenService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(`${environment.backendURL}/poll`)) {
      return next.handle(request);
    }

    const token = this.tokenService.getToken();
    const tokenRequest = request.clone({
      headers: request.headers.set('Participant-Token', token),
    });
    return next.handle(tokenRequest);
  }
}

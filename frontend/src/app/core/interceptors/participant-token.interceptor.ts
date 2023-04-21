import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {TokenService} from '../services';

@Injectable()
export class ParticipantTokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();
    console.log('Participant-Token', token);
    const tokenRequest = request.clone({
      headers: request.headers.set('Participant-Token', token),
    });
    return next.handle(tokenRequest);
  }
}

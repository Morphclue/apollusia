import {inject, Injectable, Pipe, PipeTransform} from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {KeycloakService} from '../poll/services/keycloak.service';

@Pipe({name: 'kcUser'})
@Injectable({providedIn: 'root'})
export class KcUserPipe implements PipeTransform {
  private readonly keycloakService = inject(KeycloakService);

  private readonly cache = new Map<string, KeycloakProfile | undefined>();

  transform(value: string): Observable<KeycloakProfile | undefined> {
    if (this.cache.has(value)) {
      return of(this.cache.get(value)!);
    }
    return this.keycloakService.getUser(value).pipe(
      tap(user => {
        if (user) {
          this.cache.set(value, user);
        }
      }),
      catchError(() => of(undefined)),
    );
  }
}

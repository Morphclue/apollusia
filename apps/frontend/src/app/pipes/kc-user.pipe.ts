import {inject, Pipe, PipeTransform} from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {KeycloakService} from '../poll/services/keycloak.service';

@Pipe({name: 'kcUser'})
export class KcUserPipe implements PipeTransform {
  private readonly keycloakService = inject(KeycloakService);

  private readonly cache = new Map<string, KeycloakProfile>();

  transform(value: string): Observable<KeycloakProfile> {
    if (this.cache.has(value)) {
      return of(this.cache.get(value)!);
    }
    return this.keycloakService.getUser(value).pipe(
      tap(user => this.cache.set(value, user)),
    );
  }
}

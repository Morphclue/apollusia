import {inject, Pipe, PipeTransform} from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';
import {Observable} from 'rxjs';
import {KeycloakService} from '../poll/services/keycloak.service';

@Pipe({ name: 'kcUser' })
export class KcUserPipe implements PipeTransform {
  private readonly keycloakService = inject(KeycloakService);

  transform(value: string): Observable<KeycloakProfile> {
    return this.keycloakService.getUser(value);
  }
}

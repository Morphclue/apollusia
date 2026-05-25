import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class KeycloakService {
  private http = inject(HttpClient);

  private kcUrl = `${environment.keycloak.url}/admin/realms/${environment.keycloak.realm}`;

  getUsers(filter: {
    q?: string;
    search?: string;
    briefRepresentation?: boolean;
  } = {}): Observable<KeycloakProfile[]> {
    return this.http.get<KeycloakProfile[]>(`${this.kcUrl}/users`, {params: {...filter}});
  }

  getUser(id: string): Observable<KeycloakProfile> {
    return this.http.get<KeycloakProfile>(`${this.kcUrl}/users/${id}`);
  }

  getUsersByIds(ids: string[]): Observable<KeycloakProfile[]> {
    if (!ids.length) {
      return of([]);
    }
    // Supported by Keycloak 26.3+
    // See https://github.com/keycloak/keycloak/issues/12025
    // and https://github.com/fujaba/fulib.org/issues/540#issuecomment-3117526665
    return this.getUsers({search: `id:${ids.join(' ')}`});
  }
}

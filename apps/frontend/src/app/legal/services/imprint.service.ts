import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ImprintDto} from '@apollusia/types';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class ImprintService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getImprint(): Observable<ImprintDto> {
        return this.http.get<ImprintDto>(`${environment.backendURL}/imprint`);
    }
}

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {CreateParticipantDto, Participant, Poll, PollEvent} from '../../model';

@Injectable({
  providedIn: 'root',
})
export class PollService {

  constructor(
    private http: HttpClient,
  ) {
  }

  get(id: string): Observable<Poll> {
    return this.http.get<Poll>(`${environment.backendURL}/poll/${id}`);
  }

  getEvents(id: string): Observable<PollEvent[]> {
    return this.http.get<PollEvent[]>(`${environment.backendURL}/poll/${id}/events`);
  }

  getParticipants(id: string, token: string): Observable<Participant[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Participant-Token': token,
      }),
    };
    return this.http.get<Participant[]>(`${environment.backendURL}/poll/${id}/participate`, options);
  }

  isAdmin(id: string, adminToken: string) {
    return this.http.get<boolean>(`${environment.backendURL}/poll/${id}/admin/${adminToken}`);
  }

  book(id: string, events: string[]) {
    return this.http.post(`${environment.backendURL}/poll/${id}/book`, events);
  }

  participate(id: string, participant: CreateParticipantDto): Observable<Participant> {
    return this.http.post<Participant>(`${environment.backendURL}/poll/${id}/participate`, participant);
  }

  editParticipant(id: string, participant: Participant) {
    return this.http.put<Participant>(`${environment.backendURL}/poll/${id}/participate/${participant._id}`, this.editParticipant);
  }

  deleteParticipant(id: string, participant: string) {
    return this.http.delete(`${environment.backendURL}/poll/${id}/participate/${participant}`);
  }
}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PollEventState} from '@apollusia/types';
import {EMPTY, fromEvent, Observable, retry} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {
  CreateParticipantDto,
  CreatePollLogDto,
  Participant,
  Poll,
  PollLog,
  ReadPoll,
  ReadPollEvent,
  UpdateParticipantDto,
} from '../../model';

@Injectable({
  providedIn: 'root',
})
export class PollService {

  constructor(
    private http: HttpClient,
  ) {
  }

  selectAll(poll: ReadPoll, events: ReadPollEvent[], participant: CreateParticipantDto | UpdateParticipantDto, state: PollEventState) {
    for (const event of events) {
      participant.selection[event._id] = this.maxParticipantsReached(poll, event) || this.isPastEvent(event) ? undefined : state;
    }
  }

  maxParticipantsReached(poll: ReadPoll, event: ReadPollEvent) {
    if (!poll?.settings.maxEventParticipants) {
      return false;
    }

    return event.participants >= poll.settings.maxEventParticipants;
  }

  isPastEvent(event: ReadPollEvent) {
    return Date.parse(event.start) < Date.now();
  }

  claim(adminToken: string) {
    return this.http.post(`${environment.backendURL}/poll/claim/${adminToken}`, {});
  }

  getOwn(active?: boolean): Observable<ReadPoll[]> {
    return this.http.get<ReadPoll[]>(`${environment.backendURL}/poll`, {
      params: active !== undefined ? {
        active,
      } : {},
    });
  }

  getParticipated(): Observable<ReadPoll[]> {
    return this.http.get<ReadPoll[]>(`${environment.backendURL}/poll`, {
      params: {
        participated: true,
      },
    });
  }

  get(id: string): Observable<ReadPoll> {
    return this.http.get<ReadPoll>(`${environment.backendURL}/poll/${id}`);
  }

  getEvents(id: string): Observable<ReadPollEvent[]> {
    return this.http.get<ReadPollEvent[]>(`${environment.backendURL}/poll/${id}/events`);
  }

  getParticipants(id: string): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${environment.backendURL}/poll/${id}/participate`);
  }

  isAdmin(id: string, adminToken: string) {
    return this.http.get<boolean>(`${environment.backendURL}/poll/${id}/admin/${adminToken}`);
  }

  book(id: string, events: Poll['bookedEvents']) {
    return this.http.post(`${environment.backendURL}/poll/${id}/book`, events);
  }

  participate(id: string, participant: CreateParticipantDto): Observable<Participant> {
    return this.http.post<Participant>(`${environment.backendURL}/poll/${id}/participate`, participant);
  }

  editParticipant(poll: string, participant: string, dto: UpdateParticipantDto) {
    return this.http.put<Participant>(`${environment.backendURL}/poll/${poll}/participate/${participant}`, dto);
  }

  deleteParticipant(id: string, participant: string) {
    return this.http.delete(`${environment.backendURL}/poll/${id}/participate/${participant}`);
  }

  getLogs(id: string, params?: {
    limit?: number;
    createdBefore?: string;
  }): Observable<PollLog[]> {
    return this.http.get<PollLog[]>(`${environment.backendURL}/poll/${id}/log`, {params});
  }

  streamLogs(id: string): Observable<PollLog> {
    if (!globalThis.EventSource) {
      // In SSR, EventSource is not available but we also don't care about streaming logs
      return EMPTY;
    }

    return fromEvent<MessageEvent>(new EventSource(`${environment.backendURL}/poll/${id}/log/events`), 'message').pipe(
      map(event => JSON.parse(event.data)),
      retry(),
    );
  }

  postComment(id: string, body: CreatePollLogDto): Observable<PollLog> {
    return this.http.post<PollLog>(`${environment.backendURL}/poll/${id}/log`, body);
  }
}

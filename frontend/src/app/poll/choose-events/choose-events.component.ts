import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Poll} from '../../model/poll';
import {environment} from '../../../environments/environment';
import {Participant} from '../../model/participant';
import {PollEvent} from '../../model/poll-event';

@Component({
  selector: 'app-choose-events',
  templateUrl: './choose-events.component.html',
  styleUrls: ['./choose-events.component.scss'],
})
export class ChooseEventsComponent implements OnInit {
  id: string = '';
  pollEvents: PollEvent[] = [];
  checks: boolean[] = [];
  participants: Participant[] = [];
  participateForm = new FormGroup({
    name: new FormControl('', Validators.required),
    // TODO: add checks as FormArray
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchParticipants();
  }

  onFormSubmit() {
    const attendedEvents = this.pollEvents.filter((_, i) => this.checks[i]);

    let participant: Participant = {
      name: this.participateForm.value.name ?? '',
      participation: attendedEvents,
    };

    this.http.post(`${environment.backendURL}/poll/${this.id}/participate`, participant).subscribe(() => {
      window.location.reload();
    });
  }

  checked(n: number) {
    this.checks[n] = !this.checks[n];
  }

  private fetchEvents() {
    this.http.get<Poll>(`${environment.backendURL}/poll/${this.id}`).subscribe(poll => {
      if (!poll.events) {
        return;
      }

      this.pollEvents = poll.events;
      this.checks = new Array(poll.events.length).fill(false);
    });
  }

  private fetchParticipants() {
    this.http.get<Participant[]>(`${environment.backendURL}/poll/${this.id}/participate`).subscribe(participants => {
      this.participants = participants;
    });
  }

  countParticipants(pollEvent: PollEvent) {
    return this.participants.filter(participant => participant.participation.find(event => event._id === pollEvent._id)).length;
  }
}

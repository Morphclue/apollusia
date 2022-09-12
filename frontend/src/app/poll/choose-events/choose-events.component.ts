import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {Participant, Poll, PollEvent} from '../../model';
import {TokenService} from '../../core/token/token.service';
import {environment} from '../../../environments/environment';

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
    private tokenService: TokenService,
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
    if (!this.participateForm.valid) {
      this.participateForm.setErrors({...this.participateForm.errors, 'missingName': true});
      return;
    }

    const attendedEvents = this.pollEvents.filter((_, i) => this.checks[i]);

    let participant: Participant = {
      name: this.participateForm.value.name ?? '',
      participation: attendedEvents,
      token: this.tokenService.getToken(),
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

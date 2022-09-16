import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {CreateParticipantDto, Participant, Poll, PollEvent} from '../../model';
import {TokenService} from '../../core/token/token.service';
import {environment} from '../../../environments/environment';
import {CheckboxState} from '../../model/checkbox-state';

@Component({
  selector: 'app-choose-events',
  templateUrl: './choose-events.component.html',
  styleUrls: ['./choose-events.component.scss'],
})
export class ChooseEventsComponent implements OnInit {
  id: string = '';
  poll?: Poll;
  pollEvents: PollEvent[] = [];
  checks: CheckboxState[] = [];
  editParticipant?: Participant;
  editChecks: boolean[] = [];
  bestOption: number = 1;
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
    this.fetchPoll();
    this.fetchParticipants();
  }

  onFormSubmit() {
    const attendedEvents = this.pollEvents.filter((_, i) => this.checks[i] === CheckboxState.TRUE);
    const indeterminateEvents = this.pollEvents.filter((_, i) => this.checks[i] === CheckboxState.INDETERMINATE);

    let participant: CreateParticipantDto = {
      name: this.participateForm.value.name ? this.participateForm.value.name : 'Anonymous',
      participation: attendedEvents,
      indeterminateParticipation: indeterminateEvents,
      token: this.tokenService.getToken(),
    };

    this.http.post(`${environment.backendURL}/poll/${this.id}/participate`, participant).subscribe(() => {
      window.location.reload();
    });
  }

  checkBox(n: number) {
    if (this.checks[n] === CheckboxState.INDETERMINATE) {
      this.checks[n] = CheckboxState.FALSE;
    } else if (this.checks[n] === CheckboxState.FALSE) {
      this.checks[n] = CheckboxState.TRUE;
    } else if (this.checks[n] === CheckboxState.TRUE) {
      this.checks[n] = CheckboxState.INDETERMINATE;
    }
  }

  editChecked(n: number) {
    this.editChecks[n] = !this.editChecks[n];
  }

  private fetchPoll() {
    this.http.get<Poll>(`${environment.backendURL}/poll/${this.id}`).subscribe(poll => {
      if (!poll.events) {
        return;
      }

      if (poll.settings.allowAnonymous) {
        this.participateForm.get('name')?.removeValidators(Validators.required);
        this.participateForm.get('name')?.updateValueAndValidity();
      }

      this.poll = poll;
      this.pollEvents = poll.events;
      this.checks = new Array(poll.events.length).fill(CheckboxState.FALSE);
    });
  }

  private fetchParticipants() {
    this.http.get<Participant[]>(`${environment.backendURL}/poll/${this.id}/participate`).subscribe(participants => {
      this.participants = participants;
      this.findBestOption();
    });
  }

  countParticipants(pollEvent: PollEvent) {
    return this.participants.filter(participant => participant.participation.find(event => event._id === pollEvent._id)).length;
  }

  getToken() {
    return this.tokenService.getToken();
  }

  deleteParticipation(participantId: string) {
    this.http.delete(`${environment.backendURL}/poll/${this.id}/participate/${participantId}`).subscribe(() => {
      this.participants = this.participants.filter(p => p._id !== participantId);
    });
  }

  editParticipation(participant: Participant) {
    this.editParticipant = participant;
  }

  cancelEdit() {
    this.editParticipant = undefined;
    this.editChecks = [];
  }

  confirmEdit() {
    if (!this.editParticipant) {
      return;
    }

    this.editParticipant.participation = this.pollEvents.filter((_, i) => this.editChecks[i]);
    this.http.put(`${environment.backendURL}/poll/${this.id}/participate/${this.editParticipant._id}`, this.editParticipant).subscribe(() => {
      this.cancelEdit();
      this.fetchParticipants();
    });
  }

  isFull() {
    if (this.poll?.settings.maxParticipants === undefined) {
      return false;
    }
    return this.poll?.settings.maxParticipants && this.participants.length >= this.poll.settings.maxParticipants;
  }

  isAdmin() {
    return this.poll?.adminToken === this.getToken();
  }

  userVoted() {
    return this.participants.some(participant => participant.token === this.getToken());
  }

  private findBestOption() {
    if (this.poll?.events) {
      this.bestOption = Math.max(...this.poll.events.map(event => this.countParticipants(event)));
    }
  }
}

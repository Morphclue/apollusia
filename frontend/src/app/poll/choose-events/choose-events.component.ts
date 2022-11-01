import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from 'ng-bootstrap-ext';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {CreateParticipantDto, Participant, Poll, PollEvent} from '../../model';
import {MailService, TokenService} from '../../core/services';
import {environment} from '../../../environments/environment';
import {CheckboxState} from '../../model/checkbox-state';

@Component({
  selector: 'app-choose-events',
  templateUrl: './choose-events.component.html',
  styleUrls: ['./choose-events.component.scss'],
})
export class ChooseEventsComponent implements OnInit {
  id: string = '';
  url = window.location.href;
  poll?: Poll;
  pollEvents: PollEvent[] = [];
  checks: CheckboxState[] = [];
  editChecks: CheckboxState[] = [];
  editParticipant?: Participant;
  bestOption: number = 1;
  bookedEvents: string[] = [];
  mail: string = '';
  isAdmin: boolean = false;
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
    private mailService: MailService,
    private toastService: ToastService,
    private title: Title,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    this.fetchPoll();
    this.fetchParticipants();
    this.checkAdmin();
    this.mail = this.mailService.getMail();
  }

  onFormSubmit() {
    let participant: CreateParticipantDto = {
      name: this.participateForm.value.name ? this.participateForm.value.name : 'Anonymous',
      participation: this.filterEvents(this.checks, CheckboxState.TRUE),
      indeterminateParticipation: this.filterEvents(this.checks, CheckboxState.INDETERMINATE),
      token: this.tokenService.getToken(),
      mail: this.mailService.getMail(),
    };

    this.http.post(`${environment.backendURL}/poll/${this.id}/participate`, participant).subscribe(() => {
      window.location.reload();
    });
  }

  checkBox(checks: CheckboxState[], n: number) {
    if (checks[n] === CheckboxState.INDETERMINATE) {
      checks[n] = CheckboxState.FALSE;
    } else if (checks[n] === CheckboxState.FALSE) {
      checks[n] = CheckboxState.TRUE;
    } else if (checks[n] === CheckboxState.TRUE) {
      if (this.poll?.settings.allowMaybe) {
        checks[n] = CheckboxState.INDETERMINATE;
        return;
      }
      checks[n] = CheckboxState.FALSE;
    }
  }

  private fetchPoll() {
    this.http.get<Poll>(`${environment.backendURL}/poll/${this.id}`).subscribe(async poll => {
      this.poll = poll;
      this.title.setTitle(poll.title);
      await this.fetchPollEvents();

      if (poll.settings.anonymous) {
        this.participateForm.get('name')?.removeValidators(Validators.required);
        this.participateForm.get('name')?.updateValueAndValidity();
      }
    });
  }

  private async fetchPollEvents() {
    await this.http.get<PollEvent[]>(`${environment.backendURL}/poll/${this.id}/events`).subscribe(events => {
      this.pollEvents = events.sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
      this.checks = new Array(this.pollEvents.length).fill(CheckboxState.FALSE);
      this.editChecks = new Array(this.pollEvents.length).fill(CheckboxState.FALSE);
      this.bookedEvents = this.poll?.bookedEvents ? this.poll?.bookedEvents : [];
      this.findBestOption();
    });
  }

  private fetchParticipants() {
    this.http.get<Participant[]>(`${environment.backendURL}/poll/${this.id}/participate`).subscribe(participants => {
      this.participants = participants.reverse();
    });
  }

  countParticipants(pollEvent: PollEvent) {
    const participants = this.participants.filter(p => p.participation.some(e => e._id === pollEvent._id));
    const indeterminateParticipants = this.participants.filter(p => p.indeterminateParticipation.some(e => e._id === pollEvent._id));
    return participants.length + indeterminateParticipants.length;
  }

  getToken() {
    return this.tokenService.getToken();
  }

  setEditParticipant(participant: Participant) {
    this.editParticipant = participant;
    this.editChecks = new Array(this.checks.length).fill(CheckboxState.FALSE);
    participant.participation.forEach(event => {
      this.editChecks[this.pollEvents.findIndex(e => e._id === event._id)] = CheckboxState.TRUE;
    });
    participant.indeterminateParticipation.forEach(event => {
      this.editChecks[this.pollEvents.findIndex(e => e._id === event._id)] = CheckboxState.INDETERMINATE;
    });
  }

  deleteParticipation(participantId: string) {
    this.http.delete(`${environment.backendURL}/poll/${this.id}/participate/${participantId}`).subscribe(() => {
      this.participants = this.participants.filter(p => p._id !== participantId);
      this.findBestOption();
    });
  }

  cancelEdit() {
    this.editParticipant = undefined;
    this.editChecks = new Array(this.checks.length).fill(CheckboxState.FALSE);
  }

  confirmEdit() {
    if (!this.editParticipant) {
      return;
    }

    this.editParticipant.participation = this.filterEvents(this.editChecks, CheckboxState.TRUE);
    this.editParticipant.indeterminateParticipation = this.filterEvents(this.editChecks, CheckboxState.INDETERMINATE);
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

  userVoted() {
    return this.participants.some(participant => participant.token === this.getToken());
  }

  private findBestOption() {
    if (this.pollEvents) {
      this.bestOption = Math.max(...this.pollEvents.map(event => this.countParticipants(event))) || 1;
    }
  }

  private filterEvents(checks: CheckboxState[], state: CheckboxState) {
    return this.pollEvents.filter((_, i) => checks[i] === state);
  }

  maxParticipantsReached(event: PollEvent) {
    if (!this.poll?.settings.maxEventParticipants) {
      return false;
    }

    return this.countParticipants(event) >= this.poll.settings.maxEventParticipants;
  }

  selectEvent(id: string | undefined) {
    if (!id) {
      return;
    }
    if (this.bookedEvents.includes(id)) {
      this.bookedEvents = this.bookedEvents.filter(e => e !== id);
      return;
    }

    this.bookedEvents.push(id);
  }

  book() {
    this.http.post(`${environment.backendURL}/poll/${this.id}/book`, this.bookedEvents).subscribe(() => {
      this.toastService.success('Booking', 'Booked events successfully');
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.url).then().catch(e => console.log(e));
  }

  private checkAdmin() {
    const adminToken = this.getToken();
    this.http.get<boolean>(`${environment.backendURL}/poll/${this.id}/admin/${adminToken}`).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}

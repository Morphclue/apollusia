import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {forkJoin, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {MailService, TokenService} from '../../core/services';
import {Participant, Poll, PollEvent} from '../../model';
import {CheckboxState} from '../../model/checkbox-state';
import {PollService} from '../services/poll.service';

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
  mail?: string;
  token = this.tokenService.getToken();
  isAdmin: boolean = false;
  participants: Participant[] = [];
  participateForm = new FormGroup({
    name: new FormControl('', Validators.required),
    // TODO: add checks as FormArray
  });

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private pollService: PollService,
    private tokenService: TokenService,
    private mailService: MailService,
    private toastService: ToastService,
    private title: Title,
  ) {
    const routeId: Observable<string> = route.params.pipe(map(p => p.id));
    routeId.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    this.pollService.get(this.id).subscribe(poll => {
      this.poll = poll;
      this.title.setTitle(poll.title);

      if (poll.settings.anonymous) {
        this.participateForm.get('name')?.removeValidators(Validators.required);
        this.participateForm.get('name')?.updateValueAndValidity();
      }
    });
    forkJoin([
      this.pollService.getEvents(this.id).pipe(tap(events => {
        this.pollEvents = events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        this.checks = new Array(this.pollEvents.length).fill(CheckboxState.FALSE);
        this.editChecks = new Array(this.pollEvents.length).fill(CheckboxState.FALSE);
      })),
      this.pollService.getParticipants(this.id).pipe(tap(participants => this.participants = participants)),
    ]).subscribe(() => this.findBestOption());
    this.checkAdmin();
    this.mail = this.mailService.getMail();
  }

  canSubmitChecks(checks: CheckboxState[]) {
    const maxParticipantEvents = this.poll?.settings?.maxParticipantEvents;
    if (maxParticipantEvents) {
      const selected = checks.filter(c => c === CheckboxState.TRUE).length;
      if (selected > maxParticipantEvents) {
        return false;
      }
    }

    return true;
  }

  onFormSubmit() {
    this.pollService.participate(this.id, {
      name: this.participateForm.value.name || 'Anonymous',
      participation: this.filterEvents(this.checks, CheckboxState.TRUE),
      indeterminateParticipation: this.filterEvents(this.checks, CheckboxState.INDETERMINATE),
      token: this.token,
      mail: this.mail,
    }).subscribe(participant => {
      this.participants.unshift(participant);
      this.findBestOption();
    });
  }

  countParticipants(pollEvent: PollEvent) {
    const participants = this.participants.filter(p => p.participation.includes(pollEvent._id));
    const indeterminateParticipants = this.participants.filter(p => p.indeterminateParticipation.includes(pollEvent._id));
    return participants.length + indeterminateParticipants.length;
  }

  setEditParticipant(participant: Participant) {
    this.editParticipant = participant;
    this.editChecks = new Array(this.checks.length).fill(CheckboxState.FALSE);
    participant.participation.forEach(event => {
      this.editChecks[this.pollEvents.findIndex(e => e._id === event)] = CheckboxState.TRUE;
    });
    participant.indeterminateParticipation.forEach(event => {
      this.editChecks[this.pollEvents.findIndex(e => e._id === event)] = CheckboxState.INDETERMINATE;
    });
  }

  deleteParticipation(participantId: string) {
    this.pollService.deleteParticipant(this.id, participantId).subscribe(() => {
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

    this.pollService.editParticipant(this.id, this.editParticipant).subscribe(participant => {
      this.cancelEdit();
      this.participants = this.participants.map(p => p._id === participant._id ? participant : p);
      this.findBestOption();
    });
  }

  isFull() {
    if (this.poll?.settings.maxParticipants === undefined) {
      return false;
    }
    return this.poll?.settings.maxParticipants && this.participants.length >= this.poll.settings.maxParticipants;
  }

  userVoted() {
    return this.participants.some(participant => participant.token === this.token);
  }


  maxParticipantsReached(event: PollEvent) {
    if (!this.poll?.settings.maxEventParticipants) {
      return false;
    }

    return this.countParticipants(event) >= this.poll.settings.maxEventParticipants;
  }

  selectEvent(id: string | undefined) {
    if (!id || !this.poll) {
      return;
    }
    if (this.poll.bookedEvents.includes(id)) {
      this.poll.bookedEvents = this.poll.bookedEvents.filter(e => e !== id);
      return;
    }

    this.poll.bookedEvents.push(id);
  }

  book() {
    if (!this.poll) {
      return;
    }
    this.pollService.book(this.id, this.poll.bookedEvents).subscribe(() => {
      this.toastService.success('Booking', 'Booked events successfully');
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.url).then().catch(e => console.log(e));
  }

  private findBestOption() {
    if (this.pollEvents) {
      this.bestOption = Math.max(...this.pollEvents.map(event => this.countParticipants(event))) || 1;
    }
  }

  private filterEvents(checks: CheckboxState[], state: CheckboxState) {
    return this.pollEvents.filter((_, i) => checks[i] === state).map(e => e._id);
  }

  private checkAdmin() {
    this.pollService.isAdmin(this.id, this.token).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}

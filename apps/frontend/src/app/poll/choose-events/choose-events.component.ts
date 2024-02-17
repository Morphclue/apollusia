import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {checkParticipant} from '@apollusia/logic';
import {ShowResultOptions} from '@apollusia/types/lib/schema/show-result-options';
import {ToastService} from '@mean-stream/ngbx';
import {forkJoin} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

import {MailService, TokenService} from '../../core/services';
import {CreateParticipantDto, Participant, Poll, PollEvent, UpdateParticipantDto} from '../../model';
import {PollService} from '../services/poll.service';

@Component({
  selector: 'app-choose-events',
  templateUrl: './choose-events.component.html',
  styleUrls: ['./choose-events.component.scss'],
})
export class ChooseEventsComponent implements OnInit {
  // initial state
  poll?: Poll;
  pollEvents: PollEvent[] = [];
  participants: Participant[] = [];
  isAdmin: boolean = false;
  participantCount: number;

  // aux
  bookedEvents: boolean[] = [];
  bestOption: number = 1;
  closedReason?: string = undefined;
  hiddenReason?: string = undefined;
  showResults = false;
  showNever = false;

  // view state
  newParticipant: CreateParticipantDto = {
    name: '',
    selection: {},
    token: '',
  };
  editParticipant?: Participant;
  editDto?: UpdateParticipantDto;
  errors: string[] = [];

  // helpers
  readonly ShowResultOptions = ShowResultOptions;
  id: string = '';
  url = globalThis.location?.href;
  mail: string | undefined;
  token: string;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private pollService: PollService,
    private toastService: ToastService,
    private title: Title,
    private meta: Meta,
    tokenService: TokenService,
    mailService: MailService,
  ) {
    this.mail = mailService.getMail();
    this.token = tokenService.getToken();
    this.newParticipant.token = this.token;
  }

  ngOnInit(): void {
    this.route.params.pipe(
      map(({id}) => this.id = id),
      switchMap(id => forkJoin([
        this.pollService.get(id).pipe(tap(poll => {
          this.poll = poll;
          this.title.setTitle(`${poll.title} - Apollusia`);
          this.meta.updateTag({property: 'og:title', content: poll.title});
        })),
        this.pollService.getEvents(id).pipe(tap(events => {
          this.pollEvents = events;
          this.bookedEvents = new Array(this.pollEvents.length).fill(false);
          this.validateNew();
        })),
        this.pollService.getParticipants(id).pipe(tap(participants => this.participants = participants)),
        this.pollService.isAdmin(id, this.token),
        this.pollService.getParticipantCount(id),
      ])),
    ).subscribe(([poll, events, participants, isAdmin, participantCount]) => {
      this.setDescription(poll, events, participants);
      this.clearSelection();
      this.bookedEvents = events.map(e => poll.bookedEvents.includes(e._id));
      this.isAdmin = isAdmin;
      this.participantCount = participantCount;
      this.updateHelpers();
    });
  }

  private setDescription(poll: Poll, events: PollEvent[], participants: Participant[]) {
    let description = '';
    if (poll.description) {
      description += poll.description + '\n\n';
    }
    if (poll.location) {
      description += `🌐 Location: ${poll.location}\n`;
    }
    if (poll.settings.deadline) {
      const timeZone = poll.timeZone;
      // sv-SE formats like ISO 8601, but with a space instead of a T
      const deadline = new Date(poll.settings.deadline).toLocaleString('sv-SE', {timeZone});
      const timeZoneStr = timeZone ? ` (${timeZone})` : '';
      description += `📅 Deadline: ${deadline}${timeZoneStr}\n`;
    }
    description += `✅ ${events.length} Option${events.length !== 1 ? 's' : ''} - 👤 ${participants.length} Participant${participants.length !== 1 ? 's' : ''}`;
    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({property: 'og:description', content: description});
  }

  // Primary Actions

  copyToClipboard() {
    navigator.clipboard.writeText(this.url).then().catch(e => console.log(e));
  }

  submit() {
    this.pollService.participate(this.id, this.newParticipant).subscribe(participant => {
      this.participants.unshift(participant);
      this.participantCount++;
      this.updateHelpers();
      this.clearSelection();
    }, error => {
      this.toastService.error('Submit', 'Failed to submit your participation', error);
    });
  }

  setEditParticipant(participant: Participant) {
    this.editParticipant = participant;
    this.editDto = {
      selection: {...participant.selection},
    };
    this.validateEdit();
  }

  cancelEdit() {
    this.editParticipant = undefined;
  }

  confirmEdit() {
    if (!this.editParticipant || !this.editDto) {
      return;
    }

    this.pollService.editParticipant(this.id, this.editParticipant._id, this.editDto).subscribe(participant => {
      this.cancelEdit();
      this.participants = this.participants.map(p => p._id === participant._id ? participant : p);
      this.updateHelpers();
    });
  }

  deleteParticipation(participantId: string) {
    this.pollService.deleteParticipant(this.id, participantId).subscribe(() => {
      this.participants = this.participants.filter(p => p._id !== participantId);
      this.participantCount--;
      this.updateHelpers();
    });
  }

  book() {
    const events = this.pollEvents.filter((e, i) => this.bookedEvents[i]).map(e => e._id);
    this.pollService.book(this.id, events).subscribe(() => {
      this.toastService.success('Booking', 'Booked events successfully');
    });
  }

  // View Helpers
  // TODO called from template, bad practice

  validateNew() {
    this.errors = checkParticipant(this.newParticipant, this.poll!, this.participants);
  }

  validateEdit() {
    this.errors = checkParticipant(this.editDto!, this.poll!, this.participants, this.editParticipant!._id);
  }

  countParticipants(pollEvent: PollEvent) {
    const participants = this.participants.filter(p => p.selection[pollEvent._id] === 'yes');
    const indeterminateParticipants = this.participants.filter(p => p.selection[pollEvent._id] === 'maybe');
    return participants.length + indeterminateParticipants.length;
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

  // Helpers

  private updateHelpers() {
    this.bestOption = Math.max(...this.pollEvents.map(event => this.countParticipants(event))) || 1;
    this.updateClosedReason();
    this.updateHiddenReason();
  }

  private updateClosedReason() {
    const deadline = this.poll?.settings.deadline;
    const maxParticipants = this.poll?.settings.maxParticipants;
    if (deadline && new Date(deadline) < new Date()) {
      this.closedReason = 'This poll is over because the deadline has passed. You can no longer submit your vote.';
      this.showResults = true;
    } else if (maxParticipants && this.participantCount >= maxParticipants) {
      this.closedReason = 'This poll has reached it\'s maximum number of participants. You can no longer submit your vote.';
      this.showResults = true;
    } else {
      this.closedReason = undefined;
    }
  }

  private updateHiddenReason() {
    switch (this.poll?.settings.showResult) {
      case ShowResultOptions.NEVER:
        this.showNever = !this.userVoted() && !this.isAdmin;
        if (!this.isAdmin) {
          this.hiddenReason = 'The results of this poll are hidden. You will only be able to see your own votes.';
        }
        this.showResults = true;
        break;
      case ShowResultOptions.AFTER_PARTICIPATING:
        if (!this.showResults) {
          this.hiddenReason = 'This is a blind poll. You can\'t see results or other user\'s votes until you participate yourself.';
        }
        this.showResults = this.isAdmin || this.userVoted();
        break;
      default:
        this.hiddenReason = undefined;
        this.showResults = true;
    }
  }

  private clearSelection() {
    this.newParticipant.name = this.poll?.settings?.anonymous ? 'Anonymous' : '';
    for (const event of this.pollEvents) {
      this.newParticipant.selection[event._id] = 'no';
    }
  }
}

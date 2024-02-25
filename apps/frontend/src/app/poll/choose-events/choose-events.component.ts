import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {ShowResultOptions} from '@apollusia/types/lib/schema/show-result-options';
import {ToastService} from '@mean-stream/ngbx';
import {forkJoin} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

import {MailService, TokenService} from '../../core/services';
import {Participant, ReadPoll, ReadPollEvent} from '../../model';
import {PollService} from '../services/poll.service';
import {PollEventState} from "@apollusia/types";

interface SortMethod {
  name: string;
  description: string;
  defaultDirection: 1 | -1;
  by: (p: Participant) => any;
}

@Component({
  selector: 'app-choose-events',
  templateUrl: './choose-events.component.html',
  styleUrls: ['./choose-events.component.scss'],
})
export class ChooseEventsComponent implements OnInit {
  // initial state
  poll?: ReadPoll;
  pollEvents?: ReadPollEvent[];
  participants?: Participant[];
  isAdmin: boolean = false;

  // aux
  closedReason?: string = undefined;
  hiddenReason?: string = undefined;
  showResults = false;

  currentSort = 'Created';
  currentSortDirection: 1 | -1 = 1;
  sortMethods = [
    {
      name: 'Created',
      description: 'View the participants in the order they joined the poll.',
      defaultDirection: 1,
      by: p => p.createdAt,
    },
    {
      name: 'Updated',
      description: 'View the participants in the order they last updated their vote.',
      defaultDirection: 1,
      by: p => p.updatedAt,
    },
    {
      name: 'Name',
      description: 'View the participants in alphabetical order.',
      defaultDirection: 1,
      by: p => p.name,
    },
    {
      name: 'Yes Votes',
      description: 'View the participants with the most "yes" or "maybe" votes.',
      defaultDirection: -1,
      by: p => Object.values(p.selection).filter(s => s === 'yes' || s === 'maybe').length},
    {
      name: 'First Event',
      description: 'View the participants in the order of the events they selected.',
      defaultDirection: 1,
      by: p => this.pollEvents?.findIndex(e => p.selection[e._id] === 'yes' || p.selection[e._id] === 'maybe'),
    },
  ] satisfies SortMethod[];

  // helpers
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
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({id}) => forkJoin([
        this.pollService.get(id).pipe(tap((poll) => {
          this.poll = poll;
          this.title.setTitle(`${poll.title} - Apollusia`);
          this.meta.updateTag({property: 'og:title', content: poll.title});
          this.setDescription(poll);
        })),
        this.pollService.getEvents(id).pipe(tap(events => this.pollEvents = events)),
        this.pollService.getParticipants(id).pipe(tap(participants => this.participants = participants)),
        this.pollService.isAdmin(id, this.token).pipe(tap(isAdmin => this.isAdmin = isAdmin)),
      ])),
    ).subscribe(() => {
      this.updateHelpers();
    });
  }

  private setDescription(poll: ReadPoll) {
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
    description += `✅ ${poll.events} Option${poll.events !== 1 ? 's' : ''} - 👤 ${poll.participants} Participant${poll.participants !== 1 ? 's' : ''}`;
    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({property: 'og:description', content: description});
  }

  // Primary Actions

  copyToClipboard() {
    navigator.clipboard.writeText(this.url).then().catch(e => console.log(e));
  }

  sort(sortMethod: SortMethod) {
    if (this.currentSort === sortMethod.name) {
      this.currentSortDirection *= -1;
    } else {
      this.currentSort = sortMethod.name;
      this.currentSortDirection = sortMethod.defaultDirection;
    }
    this.participants?.sortBy(sortMethod.by, this.currentSortDirection);
  }

  // Helpers

  private updateHelpers() {
    this.updateClosedReason();
    this.updateHiddenReason();
  }

  private updateClosedReason() {
    const deadline = this.poll?.settings.deadline;
    const maxParticipants = this.poll?.settings.maxParticipants;
    if (deadline && new Date(deadline) < new Date()) {
      this.closedReason = 'This poll is over because the deadline has passed. You can no longer submit your vote.';
    } else if (maxParticipants && this.poll && this.poll.participants >= maxParticipants) {
      this.closedReason = 'This poll has reached it\'s maximum number of participants. You can no longer submit your vote.';
    } else {
      this.closedReason = undefined;
    }
  }

  private updateHiddenReason() {
    switch (this.poll?.settings.showResult) {
      case ShowResultOptions.NEVER:
        this.hiddenReason = this.isAdmin ? undefined : 'The results of this poll are hidden. You will only be able to see your own votes.';
        this.showResults = true;
        break;
      case ShowResultOptions.AFTER_PARTICIPATING:
        this.showResults = this.isAdmin || this.userVoted();
        this.hiddenReason = this.showResults ? undefined : 'This is a blind poll. You can\'t see results or other user\'s votes until you participate yourself.';
        break;
      default:
        this.hiddenReason = undefined;
        this.showResults = true;
    }
  }

  private userVoted(): boolean {
    return this.participants?.some(participant => participant.token === this.token) ?? false;
  }
}

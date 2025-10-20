import {AsyncPipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import {ShowResultOptions} from '@apollusia/types/lib/schema/show-result-options';
import {ToastService} from '@mean-stream/ngbx';
import {
  NgbTooltip,
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbDropdownButtonItem,
  NgbDropdownItem
} from '@ng-bootstrap/ng-bootstrap';
import {forkJoin} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

import {InfoTableComponent} from '../../core/info-table/info-table.component';
import {TokenService} from '../../core/services';
import {StorageService} from '../../core/services/storage.service';
import {Participant, ReadPoll, ReadPollEvent} from '../../model';
import {EventListComponent} from '../event-list/event-list.component';
import {PollLogComponent} from '../poll-log/poll-log.component';
import {PollService} from '../services/poll.service';
import {TableComponent} from '../table/table.component';

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
  imports: [
    InfoTableComponent,
    NgbTooltip,
    RouterLink,
    RouterLinkActive,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    TableComponent,
    EventListComponent,
    PollLogComponent,
    RouterOutlet,
    AsyncPipe,
  ],
})
export class ChooseEventsComponent implements OnInit {
  public route = inject(ActivatedRoute);
  private pollService = inject(PollService);
  private title = inject(Title);
  private meta = inject(Meta);
  tokenService = inject(TokenService);
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  // initial state
  poll?: ReadPoll;
  pollEvents?: ReadPollEvent[];
  participants?: Participant[];
  isAdmin: boolean = false;
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  closedReason?: string;
  hiddenReason?: string;

  bestOption: number = 1;

  readonly view$ = this.route.queryParams.pipe(map(({view}) => view ?? 'table'));
  readonly views = [
    {id: 'table', name: 'Table', icon: 'bi-table'},
    {id: 'events', name: 'List of Events', icon: 'bi-list-ol'},
  ];

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
  token: string;

  constructor(
  ) {
    this.token = this.tokenService.getToken();
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({id}) => forkJoin([
        this.pollService.get(id).pipe(tap((poll) => {
          this.poll = poll;
          this.title.setTitle(`${poll.title} - Apollusia`);
          this.meta.updateTag({property: 'og:title', content: poll.title});
          this.setDescription(poll);
          this.storageService.set('recentPolls/' + poll.id, JSON.stringify({
            id: poll.id,
            title: poll.title,
            location: poll.location,
            visitedAt: new Date(),
          }));
        })),
        this.pollService.getEvents(id).pipe(tap(events => this.pollEvents = events)),
        this.pollService.getParticipants(id).pipe(tap(participants => this.participants = participants)),
        this.pollService.isAdmin(id, this.token).pipe(tap(isAdmin => this.isAdmin = isAdmin)),
      ])),
    ).subscribe(() => {
      this.updateHelpers();
    }, error => {
      if (error.status === 404) {
        // Poll does not exist
        this.title.setTitle('Poll not found - Apollusia');
        this.closedReason = 'This poll does not exist.';
        this.storageService.delete(`recentPolls/${this.route.snapshot.params['id']}`);
      } else {
        this.toastService.error('Failed to load poll', 'Please try again later.', error);
      }
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

  sort(sortMethod: SortMethod) {
    if (this.currentSort === sortMethod.name) {
      this.currentSortDirection *= -1;
    } else {
      this.currentSort = sortMethod.name;
      this.currentSortDirection = sortMethod.defaultDirection;
    }
    this.participants?.sort((a, b) => {
      const aVal = sortMethod.by(a);
      const bVal = sortMethod.by(b);
      if (aVal < bVal) {
        return -this.currentSortDirection;
      }
      if (aVal > bVal) {
        return this.currentSortDirection;
      }
      return 0;
    });
  }

  // Helpers

  private updateHelpers() {
    this.bestOption = Math.max(1, ...this.pollEvents!.map(event => event.participants));
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
        break;
      case ShowResultOptions.AFTER_PARTICIPATING:
        this.hiddenReason = this.isAdmin || this.userVoted() ? undefined : 'This is a blind poll. You can\'t see results or other user\'s votes until you participate yourself.';
        break;
      case ShowResultOptions.AFTER_DEADLINE: {
        const deadline = this.poll.settings.deadline;
        if (this.isAdmin || !deadline || new Date(deadline) < new Date()) {
          this.hiddenReason = undefined;
        } else {
          this.hiddenReason = 'The results of this poll are hidden until the deadline is over. You can only see your own votes.';
        }
        break;
      }
      default:
        this.hiddenReason = undefined;
    }
  }

  private userVoted(): boolean {
    return this.participants?.some(participant => participant.token === this.token) ?? false;
  }

  onTableChange() {
    if(this.poll) {
      this.pollService.getEvents(this.poll._id).subscribe((events)=>{
        this.pollEvents = events;
        this.updateHelpers();
      })
    }
  }
}

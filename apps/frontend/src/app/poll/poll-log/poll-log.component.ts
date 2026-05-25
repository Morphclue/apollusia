import {CommonModule} from '@angular/common';
import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ShowResultOptions} from '@apollusia/types/lib/schema/show-result-options';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs/operators';

import {CoreModule} from '../../core/core.module';
import {PollLog, ReadPoll} from '../../model';
import {PollLogItemComponent} from '../poll-log-item/poll-log-item.component';
import {PollService} from '../services/poll.service';

@Component({
  selector: 'apollusia-poll-log',
  templateUrl: './poll-log.component.html',
  styleUrl: './poll-log.component.scss',
  imports: [CommonModule, CoreModule, FormsModule, NgbPopover, PollLogItemComponent],
})
export class PollLogComponent implements OnInit {
  readonly poll = input.required<ReadPoll>();

  private readonly route = inject(ActivatedRoute);
  private readonly pollService = inject(PollService);

  readonly logs = signal<PollLog[]>([]);
  readonly commentName = signal('');
  readonly commentBody = signal('');

  readonly showMore = signal(false);

  /** How many items to load initially, plus one to check if there are more items */
  private readonly limit = 11;

  /** A record of all fields and values and how they are displayed in "poll changed" events */
  protected readonly changeDisplayKey: Record<string | symbol, string> = {
    title: 'Title',
    description: 'Description',
    location: 'Location',
    timeZone: 'Timezone',
    'settings.deadline': 'Deadline',
    'settings.maxParticipants': 'Maximum number of participants',
    'settings.maxParticipantEvents': 'Maximum number of choices per participant',
    'settings.maxEventParticipants': 'Maximum number of participants per event',
    'settings.allowMaybe': 'Allow Maybe option',
    'settings.allowEdit': 'Allow editing',
    'settings.anonymous': 'Anonymous participation',
    'settings.allowComments': 'Allow Comments',
    'settings.logHistory': 'Enable Change History',
    'settings.showResult': 'Show results to participants',
  };
  protected readonly changeDisplayValues: Record<string | symbol, string> = {
    // values of showResult:
    [ShowResultOptions.IMMEDIATELY]: 'Immediately',
    [ShowResultOptions.AFTER_PARTICIPATING]: 'After participating',
    [ShowResultOptions.AFTER_DEADLINE]: 'After deadline',
    [ShowResultOptions.NEVER]: 'Never',
    true: 'Yes',
    false: 'No',
  };

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({id}) => this.pollService.getLogs(id, {limit: this.limit})),
    ).subscribe(logs => {
      if (logs.length === this.limit) {
        this.logs.set(logs.slice(0, -1));
        this.showMore.set(true);
      } else {
        this.logs.set(logs);
        this.showMore.set(false);
      }
    });

    this.route.params.pipe(
      switchMap(({id}) => this.pollService.streamLogs(id)),
    ).subscribe(log => {
      this.addUnique(log);
    });
  }

  loadMore() {
    this.pollService.getLogs(this.route.snapshot.params['id'], {
      limit: this.limit,
      createdBefore: this.logs().at(-1)?.createdAt.toString(),
    }).subscribe(logs => {
      if (logs.length === this.limit) {
        this.logs.update(oldLogs => [...oldLogs, ...logs.slice(0, -1)]);
        this.showMore.set(true);
      } else {
        this.logs.update(oldLogs => [...oldLogs, ...logs]);
        this.showMore.set(false);
      }
    });
  }

  postComment() {
    this.pollService.postComment(this.route.snapshot.params['id'], {
      type: 'comment',
      data: {
        name: this.commentName(),
        body: this.commentBody(),
      },
    }).subscribe(log => {
      this.commentBody.set('');
      this.addUnique(log);
    });
  }

  private addUnique(log: PollLog) {
    this.logs.update(logs => {
      const index = logs.findIndex(l => l._id === log._id);
      if (index >= 0) {
        const copy = logs.slice();
        copy[index] = log;
        return copy;
      } else {
        return [log, ...logs];
      }
    });
  }
}

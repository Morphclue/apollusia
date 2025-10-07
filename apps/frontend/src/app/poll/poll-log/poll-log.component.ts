import {CommonModule} from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {CoreModule} from '../../core/core.module';
import {PollLog, ReadPoll} from '../../model';
import {PollService} from '../services/poll.service';

@Component({
  selector: 'apollusia-poll-log',
  templateUrl: './poll-log.component.html',
  styleUrl: './poll-log.component.scss',
  imports: [CommonModule, CoreModule, FormsModule],
})
export class PollLogComponent implements OnInit {
  @Input({required: true}) poll: ReadPoll;
  private route = inject(ActivatedRoute);
  private pollService = inject(PollService);

  logs: PollLog[] = [];
  commentName = '';
  commentBody = '';

  showMore = false;

  /** How many items to load initially, plus one to check if there are more items */
  private readonly limit = 11;

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({id}) => this.pollService.getLogs(id, {limit: this.limit})),
    ).subscribe(logs => {
      if (logs.length === this.limit) {
        this.logs = logs.slice(0, -1);
        this.showMore = true;
      } else {
        this.logs = logs;
        this.showMore = false;
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
      createdBefore: this.logs.at(-1)?.createdAt.toString(),
    }).subscribe(logs => {
      if (logs.length === this.limit) {
        this.logs.push(...logs.slice(0, -1));
        this.showMore = true;
      } else {
        this.logs.push(...logs);
        this.showMore = false;
      }
    });
  }

  postComment() {
    this.pollService.postComment(this.route.snapshot.params['id'], {
      type: 'comment',
      data: {
        name: this.commentName,
        body: this.commentBody,
      },
    }).subscribe(log => {
      this.commentBody = '';
      this.addUnique(log);
    });
  }

  private addUnique(log: PollLog) {
    const index = this.logs.findIndex(l => l._id === log._id);
    if (index >= 0) {
      this.logs[index] = log;
    } else {
      this.logs.unshift(log);
    }
  }
}

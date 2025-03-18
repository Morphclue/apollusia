import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PollLog} from '@apollusia/types';
import {CreatePollLogDto} from '@apollusia/types/lib/dto/poll-log.dto';
import {switchMap} from 'rxjs/operators';
import {CoreModule} from '../../core/core.module';
import {PollService} from '../services/poll.service';

@Component({
  selector: 'apollusia-poll-log',
  imports: [CommonModule, CoreModule, FormsModule],
  templateUrl: './poll-log.component.html',
  styleUrl: './poll-log.component.scss',
})
export class PollLogComponent implements OnInit {
  logs: PollLog[] = [];
  commentName = '';
  commentBody = '';

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({id}) => this.pollService.getLogs(id)),
    ).subscribe(logs => {
      this.logs = logs;
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
      this.logs.push(log);
    });
  }
}

import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PollLog} from '@apollusia/types';
import {switchMap} from 'rxjs/operators';
import {CoreModule} from '../../core/core.module';
import {PollService} from '../services/poll.service';

@Component({
  selector: 'apollusia-poll-log',
  imports: [CommonModule, CoreModule],
  templateUrl: './poll-log.component.html',
  styleUrl: './poll-log.component.scss',
})
export class PollLogComponent implements OnInit {
  logs: PollLog[] = [];

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
}

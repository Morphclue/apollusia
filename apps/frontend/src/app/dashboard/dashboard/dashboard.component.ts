import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap, tap} from 'rxjs/operators';

import {ReadPoll} from '../../model';
import {PollService} from '../../poll/services/poll.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  polls: ReadPoll[] = [];
  participated = false;
  searchText = '';

  constructor(
    private pollService: PollService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap(({participated}) => this.participated = participated),
      switchMap(({participated, active}) => {
        if (participated) {
          return this.pollService.getParticipated();
        }
        return this.pollService.getOwn(active);
      }),
    ).subscribe(polls => this.polls = polls);
  }
}

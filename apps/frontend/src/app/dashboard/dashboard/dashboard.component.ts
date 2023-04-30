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
  admin = true;
  searchText = '';

  constructor(
    private pollService: PollService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      tap(({participated}) => this.admin = !participated),
      switchMap(({participated, active}) => {
        if (participated) {
          return this.pollService.getParticipated();
        }
        return this.pollService.getOwn(active);
      }),
    ).subscribe(polls => this.polls = polls);
  }
}

import {Component, OnInit} from '@angular/core';

import {ReadPoll} from '../../model';
import {PollService} from '../../poll/services/poll.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentAdminPolls: ReadPoll[] = [];
  oldAdminPolls: ReadPoll[] = [];
  participantPolls: ReadPoll[] = [];

  constructor(
    private pollService: PollService,
  ) {
  }

  ngOnInit(): void {
    this.pollService.getOwn(true).subscribe(polls => this.currentAdminPolls = polls);
    this.pollService.getOwn(false).subscribe(polls => this.oldAdminPolls = polls);
    this.pollService.getParticipated().subscribe(polls => this.participantPolls = polls);
  }
}

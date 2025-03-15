import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {KeycloakService} from 'keycloak-angular';
import {switchMap, tap} from 'rxjs/operators';

import {TokenService} from '../../core/services';
import {ReadPoll} from '../../model';
import {PollService} from '../../poll/services/poll.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  polls: ReadPoll[] = [];
  participated = false;
  loggedIn = false;
  unclaimed = false;
  adminToken = '';
  searchText = '';

  constructor(
    private pollService: PollService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private keycloakService: KeycloakService,
    tokenService: TokenService,
  ) {
    this.loggedIn = keycloakService.isLoggedIn();
    this.adminToken = tokenService.getToken();
  }

  ngOnInit(): void {

    this.route.queryParams.pipe(
      tap(({participated}) => this.participated = participated),
      switchMap(({participated, active}) => {
        if (participated) {
          return this.pollService.getParticipated();
        }
        return this.pollService.getOwn(active !== 'false');
      }),
    ).subscribe(polls => {
      this.polls = polls;
      this.unclaimed = polls.some(poll => !poll.createdBy);
    });
  }

  claim() {
    this.pollService.claim(this.adminToken).subscribe(() => {
      this.toastService.success('Claim Polls', 'Successfully claimed polls.');
      this.unclaimed = false;
    });
  }

  login() {
    this.keycloakService.login();
  }
}

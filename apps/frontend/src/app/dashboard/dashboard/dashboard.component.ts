import {NgOptimizedImage} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {KeycloakService} from 'keycloak-angular';
import {switchMap, tap} from 'rxjs/operators';

import {TokenService} from '../../core/services';
import {ReadPoll} from '../../model';
import {PollService} from '../../poll/services/poll.service';
import {CardComponent} from '../card/card.component';
import {SearchPipe} from '../pipes/search.pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    CardComponent,
    SearchPipe,
  ],
})
export class DashboardComponent implements OnInit {
  private pollService = inject(PollService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private keycloakService = inject(KeycloakService);
  tokenService = inject(TokenService);
  polls: ReadPoll[] = [];
  participated = false;
  loggedIn = false;
  unclaimed = false;
  adminToken = '';
  searchText = '';

  constructor(
  ) {
    this.loggedIn = this.keycloakService.isLoggedIn();
    this.adminToken = this.tokenService.getToken();
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

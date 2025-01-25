import {Component, OnInit} from '@angular/core';
import {Theme, ThemeService} from '@mean-stream/ngbx';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import {Subject} from 'rxjs';

import {environment} from '../../../environments/environment';
import {StorageService} from '../services/storage.service';

type RecentPoll = { id: string; title: string; location: string; visitedAt: string; };

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  readonly environment = environment;
  readonly currentYear = new Date().getFullYear();
  readonly version = APP_VERSION;
  readonly changelogLink = (() => {
    const [version, , commit] = APP_VERSION.split('-');
    if (commit) {
      // e.g. v1.0.0-1-g1234567, git describe included the commit, so we show the diff
      return `compare/${version}...${commit}`;
    } else {
      // for tagged versions, just link to the changelog
      return `releases/tag/${version}`;
    }
  })();

  themes = [
    {
      name: 'Light',
      value: 'light',
      icon: 'bi-sun',
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: 'bi-moon-stars',
    },
    {
      name: 'Auto',
      value: 'auto',
      icon: 'bi-circle-half',
    },
  ];
  theme$: Subject<Theme>;

  recentPolls: RecentPoll[] = [];

  user?: KeycloakProfile;

  constructor(
    themeService: ThemeService,
    protected readonly offcanvas: NgbOffcanvas,
    private readonly storageService: StorageService,
    private readonly keycloakService: KeycloakService,
  ) {
    this.theme$ = themeService.theme$;
  }

  loadRecentPolls() {
    this.recentPolls = Object.values(this.storageService.getAll('recentPolls/'))
      .map((item) => JSON.parse(item))
      .sort((a, b) => Date.parse(b.visitedAt) - Date.parse(a.visitedAt))
      .slice(0, 10)
    ;
  }

  ngOnInit() {
    this.keycloakService.loadUserProfile().then(user => {
      this.user = user;
    }, () => {});
  }

  login() {
    this.keycloakService.login({
      redirectUri: window.location.href,
    });
  }

  logout() {
    this.keycloakService.logout(window.location.href);
  }

  removeRecent(poll: RecentPoll) {
    this.recentPolls.splice(this.recentPolls.indexOf(poll), 1);
    this.storageService.delete(`recentPolls/${poll.id}`);
  }
}

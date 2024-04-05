import {Component} from '@angular/core';
import {Theme, ThemeService} from '@mean-stream/ngbx';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly currentYear = new Date().getFullYear();

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

  recentPolls: { id: string; title: string; location: string; visitedAt: string; }[] = [];

  constructor(
    themeService: ThemeService,
    protected readonly offcanvas: NgbOffcanvas,
    private readonly storageService: StorageService,
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
}

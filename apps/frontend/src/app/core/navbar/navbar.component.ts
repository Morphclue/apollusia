import {Component, OnInit} from '@angular/core';
import {Theme, ThemeService} from '@mean-stream/ngbx';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
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

  constructor(
    themeService: ThemeService,
    protected readonly offcanvas: NgbOffcanvas,
  ) {
    this.theme$ = themeService.theme$;
  }

  ngOnInit(): void {
  }
}

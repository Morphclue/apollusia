import {Component, OnInit} from '@angular/core';
import {Theme, ThemeService} from '@mean-stream/ngbx';
import {Subject} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuCollapsed: boolean = true;

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
  ) {
    this.theme$ = themeService.theme$;
  }

  ngOnInit(): void {
  }
}

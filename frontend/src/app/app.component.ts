import {Component, OnInit} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';

import {TokenService} from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'apollusia';

  constructor(
    private tokenService: TokenService,
    private swUpdate: SwUpdate,
  ) {
  }

  ngOnInit(): void {
    this.tokenService.getToken();
    this.swUpdate.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY' && confirm('A new update is available. Do you want to install now?')) {
        globalThis.location?.reload();
      }
    });
  }
}

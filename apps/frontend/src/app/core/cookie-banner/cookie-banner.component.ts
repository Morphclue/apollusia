import {Component, OnInit} from '@angular/core';

import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
  standalone: false,
})
export class CookieBannerComponent implements OnInit {
  dismissed = false;

  constructor(
    private storageService: StorageService,
  ) {
  }

  ngOnInit(): void {
    this.dismissed = this.storageService.get('cookiesAllowed') === 'true';
  }

  dismiss() {
    this.dismissed = true;
  }

  allow() {
    this.dismiss();
    this.storageService.set('cookiesAllowed', 'true');
  }
}

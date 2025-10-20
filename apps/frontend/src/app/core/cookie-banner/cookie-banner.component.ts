import { Component, inject, OnInit } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
  imports: [NgbAlert],
})
export class CookieBannerComponent implements OnInit {
  private storageService = inject(StorageService);
  dismissed = false;

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

import {Component, OnInit} from '@angular/core';

import {MailService} from '../../core/services';
import {Settings} from '../settings';

@Component({
  selector: 'apollusia-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settings = new Settings();

  constructor(
    private mailService: MailService,
  ) {
  }

  ngOnInit(): void {
    this.settings.email = this.mailService.getMail() || '';
  }

  save() {
    this.mailService.setMail(this.settings.email);
  }
}


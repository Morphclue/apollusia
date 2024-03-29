import {Component, OnInit} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';

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
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.settings.email = this.mailService.getMail() || '';
  }

  save() {
    this.mailService.setMail(this.settings.email);
    this.toastService.success('Settings', 'Sucessfully saved settings.');
  }
}


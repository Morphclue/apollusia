import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {MailService} from '../../core/services';

@Component({
  selector: 'apollusia-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  mailForm = new FormGroup({
    mail: new FormControl('', Validators.email),
  });

  constructor(
    public route: ActivatedRoute,
    private mailService: MailService,
  ) {
  }

  ngOnInit(): void {
    this.mailForm.controls.mail.setValue(this.mailService.getMail() || '');
  }

  save() {
    if (!this.mailForm.valid) {
      return;
    }

    if (this.mailForm.controls.mail.value === '') {
      this.mailService.setMail('');
      return;
    }

    if (this.mailForm.controls.mail.value == null) {
      return;
    }
    this.mailService.setMail(this.mailForm.controls.mail.value);
    window.location.reload();
  }
}


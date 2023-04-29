import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ModalComponent} from '@mean-stream/ngbx';

import {MailService} from '../../core/services';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {
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

  save(modal: ModalComponent) {
    if (!this.mailForm.valid) {
      return;
    }

    if (this.mailForm.controls.mail.value === '') {
      this.mailService.setMail('');
      modal.close();
      return;
    }

    if (this.mailForm.controls.mail.value == null) {
      return;
    }
    this.mailService.setMail(this.mailForm.controls.mail.value);
    modal.close();
    window.location.reload();
  }
}


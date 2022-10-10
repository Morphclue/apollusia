import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
    private modalService: NgbModal,
    private mailService: MailService,
  ) {
  }

  ngOnInit(): void {
    this.mailForm.controls.mail.setValue(this.mailService.getMail());
  }

  save() {
    if (!this.mailForm.valid) {
      return;
    }

    if (this.mailForm.controls.mail.value === '') {
      this.mailService.setMail('');
      this.modalService.dismissAll();
      return;
    }

    if (this.mailForm.controls.mail.value == null) {
      return;
    }
    this.mailService.setMail(this.mailForm.controls.mail.value);
    this.modalService.dismissAll();
  }
}


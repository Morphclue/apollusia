import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {MailService} from '../services/mail.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuCollapsed: boolean = true;
  mailForm = new FormGroup({
    mail: new FormControl('',
      Validators.email,
    ),
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
      this.modalService.dismissAll();
      return;
    }

    if (this.mailForm.controls.mail.value != null) {
      this.mailService.setMail(this.mailForm.controls.mail.value);
      this.modalService.dismissAll();
    }
  }

  open(content: any) {
    this.modalService.open(content).result.then(() => {
      content.close();
    }).catch(() => {
    });
  }
}

import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-mail-alert',
  templateUrl: './mail-alert.component.html',
  styleUrls: ['./mail-alert.component.scss'],
  standalone: false,
})
export class MailAlertComponent {
  constructor(
    public route: ActivatedRoute,
  ) {
  }
}

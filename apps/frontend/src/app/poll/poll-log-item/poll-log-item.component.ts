import {DatePipe} from '@angular/common';
import {Component, inject, input, OnInit, signal} from '@angular/core';
import {KeycloakProfile} from 'keycloak-js';
import {PollLog} from '../../model';
import {KcUserPipe} from '../../pipes';

@Component({
  selector: 'apollusia-poll-log-item',
  imports: [
    DatePipe,
  ],
  templateUrl: './poll-log-item.component.html',
  styleUrl: './poll-log-item.component.scss',
})
export class PollLogItemComponent implements OnInit {
  readonly icon = input<string>();
  readonly log = input<PollLog>();
  /** Show the user from createdBy. The value provides the default. Hidden if set to an empty string. */
  readonly showUser = input<string>('The poll owner');
  readonly showTimestamp = input<boolean>(true);

  // Use pipe instead of KeycloakService for caching
  private readonly kcUserPipe = inject(KcUserPipe);

  protected readonly user = signal<KeycloakProfile | undefined>(undefined);

  ngOnInit() {
    const createdBy = this.log()?.createdBy;
    if (this.showUser() && createdBy) {
      this.kcUserPipe.transform(createdBy).subscribe(user => {
        this.user.set(user);
      });
    }
  }
}

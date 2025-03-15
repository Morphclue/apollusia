import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import * as platform from 'platform';

import {environment} from '../../../environments/environment';
import {MailService} from '../../core/services';
import {PushService} from '../../poll/services/push.service';

interface PushInfo {
  device: string;
  browser: string;
  createdAt: Date;
  token: any;
}

@Component({
  selector: 'apollusia-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false,
})
export class SettingsComponent implements OnInit {
  email = '';
  user?: KeycloakProfile;
  pushInfo: PushInfo[] = [];

  constructor(
    private mailService: MailService,
    private toastService: ToastService,
    private keycloakService: KeycloakService,
    private pushService: PushService,
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.email = this.mailService.getMail() || '';
    this.keycloakService.loadUserProfile().then((user) => {
      this.user = user;
      this.email ||= user.email || '';
      this.pushInfo = (user.attributes?.['pushTokens'] as string[])?.map((token) => JSON.parse(token)) ?? [];
    });
  }

  addPush() {
    this.pushService.getPushToken().then(token => {
      if (this.pushInfo.some(p => p.token.endpoint === token.endpoint)) {
        this.toastService.warn('Add Push Device', 'This device is already registered.');
        return;
      }
      this.pushInfo.push({
        device: platform.os?.family ?? 'Unknown OS',
        browser: platform.name ?? 'Unknown Browser',
        createdAt: new Date(),
        token,
      });
      this.saveUser().subscribe({
        next: () => this.toastService.success('Add Push Device', 'Successfully registered device.'),
        error: error => this.toastService.error('Add Push Device', 'Failed to save user data.', error),
      })
    }, error => {
      this.toastService.error('Add Push Device', 'Failed to register push device.', error);
    });
  }

  removePush(info: PushInfo) {
    this.pushInfo = this.pushInfo.filter((i) => i !== info);
    this.saveUser().subscribe({
      next: () => this.toastService.success('Push Settings', 'Successfully remove device.'),
      error: error => this.toastService.error('Push Settings', 'Failed to remove device', error),
    })
  }

  save() {
    this.mailService.setMail(this.email);
    if (!this.user) {
      this.toastService.success('Account Settings', 'Successfully saved settings.');
      return;
    }
    this.saveUser().subscribe({
      next: () => this.toastService.success('Account Settings', 'Successfully saved account settings.'),
      error: error => this.toastService.error('Account Settings', 'Failed to save account settings.', error),
    });
  }

  private saveUser() {
    return this.http.post(`${environment.keycloak.url}/realms/${environment.keycloak.realm}/account`, {
      ...this.user,
      attributes: {
        ...this.user?.attributes,
        pushTokens: this.pushInfo.map((info) => JSON.stringify(info)),
      },
    });
  }
}


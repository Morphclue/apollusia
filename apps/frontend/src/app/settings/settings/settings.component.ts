import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import * as platform from 'platform';

import {environment} from '../../../environments/environment';
import {MailService} from '../../core/services';
import {PushService} from '../../poll/services/push.service';
import {Settings} from '../settings';

interface PushInfo {
  device: string;
  browser: string;
  token: any;
}

@Component({
  selector: 'apollusia-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settings = new Settings();
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
    this.settings.email = this.mailService.getMail() || '';
    this.keycloakService.loadUserProfile().then((user) => {
      this.user = user;
      this.pushInfo = (user.attributes?.['pushTokens'] as string[])?.map((token) => JSON.parse(token)) ?? [];
    });
  }

  addPush() {
    this.pushService.getPushToken().then(token => {
      if (this.pushInfo.some(p => p.token.endpoint === token.endpoint)) {
        this.toastService.error('Push', 'This device is already registered.');
        return;
      }
      this.pushInfo.push({
        device: platform.os?.family ?? 'Unknown OS',
        browser: platform.name ?? 'Unknown Browser',
        token,
      });
      this.toastService.success('Push', 'Successfully registered device.');
    }, error => {
      this.toastService.error('Push', 'Failed to register device.', error);
    });
  }

  removePush(info: PushInfo) {
    this.pushInfo = this.pushInfo.filter((i) => i !== info);
  }

  save() {
    this.mailService.setMail(this.settings.email);
    this.toastService.success('Settings', 'Sucessfully saved settings.');
    this.user && this.http.post(`${environment.keycloak.url}/realms/${environment.keycloak.realm}/account`, {
      ...this.user,
      attributes: {
        ...this.user.attributes,
        pushTokens: this.pushInfo.map((info) => JSON.stringify(info)),
      },
    }).subscribe({
      next: () => this.toastService.success('Push', 'Successfully saved push tokens.'),
      error: error => this.toastService.error('Push', 'Failed to save push tokens.', error),
    });
  }
}


import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import * as platform from 'platform';

import {environment} from '../../../environments/environment';
import {PushService} from '../../poll/services/push.service';

interface PushInfo {
  device: string;
  browser: string;
  createdAt: Date;
  token: PushSubscription;
}

@Component({
  selector: 'apollusia-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false,
})
export class SettingsComponent implements OnInit {
  user?: KeycloakProfile;
  pushInfo: PushInfo[] = [];

  pushEnabled = false;
  existingPush?: PushSubscription;

  constructor(
    private toastService: ToastService,
    private keycloakService: KeycloakService,
    private pushService: PushService,
    private http: HttpClient,
  ) {
  }

  async ngOnInit() {
    this.user = await this.keycloakService.loadUserProfile();
    this.pushInfo = (this.user.attributes?.['pushTokens'] as string[])?.map((token) => JSON.parse(token)) ?? [];

    this.pushEnabled = this.pushService.isEnabled();
    if (this.pushEnabled) {
      const existingSub = await this.pushService.getSubscription();
      if (existingSub) {
        this.existingPush = existingSub;
      }
    }
  }

  addPush() {
    this.pushService.requestSubscription().then(token => {
      this.existingPush = token;
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

  async removePush(info: PushInfo) {
    if (info.token.endpoint === this.existingPush?.endpoint) {
      await this.pushService.unsubscribe();
      this.existingPush = undefined;
    }

    this.pushInfo = this.pushInfo.filter((i) => i !== info);
    this.saveUser().subscribe({
      next: () => this.toastService.success('Push Settings', 'Successfully remove device.'),
      error: error => this.toastService.error('Push Settings', 'Failed to remove device', error),
    })
  }

  save() {
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


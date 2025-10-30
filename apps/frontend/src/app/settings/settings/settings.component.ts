import {DatePipe, LowerCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import Keycloak, {type KeycloakProfile} from 'keycloak-js';
import * as platform from 'platform';

import notificationSettings from './notification-settings.json';
import {environment} from '../../../environments/environment';
import {PushService} from '../../poll/services/push.service';
import {TokenComponent} from '../token/token.component';

interface PushInfo {
  device: string;
  browser: string;
  createdAt: Date;
  token: PushSubscription;
}

interface NotificationSettings {
  title: string;
  description: string;
  types: {
    key: string;
    icon: string;
    title: string;
    description: string;
    email?: boolean;
    push?: boolean;
  }[];
}

@Component({
  selector: 'apollusia-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    TokenComponent,
    FormsModule,
    RouterLink,
    NgbTooltip,
    LowerCasePipe,
    DatePipe,
  ],
})
export class SettingsComponent implements OnInit {
  readonly notificationSettings: NotificationSettings[] = notificationSettings;
  private toastService = inject(ToastService);
  private keycloak = inject(Keycloak);
  private pushService = inject(PushService);
  private http = inject(HttpClient);

  user?: KeycloakProfile;
  pushInfo: PushInfo[] = [];
  notifications: Partial<Record<string, boolean>> = {};

  pushEnabled = false;
  existingPush?: PushSubscription;

  async ngOnInit() {
    this.user = await this.keycloak.loadUserProfile();
    this.pushInfo = (this.user.attributes?.['pushTokens'] as string[])?.map((token) => JSON.parse(token)) ?? [];
    this.notifications = Object.fromEntries((this.user.attributes?.['notifications'] as string[] ?? this.getDefaultNotificationSettings()).map((n) => [n, true]));

    this.pushEnabled = this.pushService.isEnabled();
    if (this.pushEnabled) {
      const existingSub = await this.pushService.getSubscription();
      if (existingSub) {
        this.existingPush = existingSub;
      }
    }
  }

  private getDefaultNotificationSettings() {
    const settings: string[] = [];
    for (const category of this.notificationSettings) {
      for (const type of category.types) {
        if (type.email !== false) {
          settings.push(type.key + ':email');
        }
        if (type.push !== false) {
          settings.push(type.key + ':push');
        }
      }
    }
    return settings;
  }

  login() {
    this.keycloak.login();
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
      next: () =>
        this.toastService.success(
          'Account Settings',
          'Successfully saved account settings.',
        ),
      error: (error) =>
        this.toastService.error(
          'Account Settings',
          'Failed to save account settings.',
          error,
        ),
    });
  }

  saveNotificationSettings() {
    if (!this.user) {
      return;
    }

    (this.user.attributes ??= {})['notifications'] = Object.keys(this.notifications).filter((key) => this.notifications[key]);
    this.saveUser().subscribe({
      next: () => this.toastService.success('Notification Settings', 'Successfully saved notification settings.'),
      error: error => this.toastService.error('Notification Settings', 'Failed to save notification settings.', error),
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


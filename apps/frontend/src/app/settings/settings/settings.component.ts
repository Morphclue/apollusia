import {DatePipe, LowerCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import Keycloak, {type KeycloakProfile} from 'keycloak-js';
import * as platform from 'platform';

import notificationSettings, {NotificationSettings} from './notification-settings';
import {environment} from '../../../environments/environment';
import {PushService} from '../../poll/services/push.service';
import {TokenComponent} from '../token/token.component';

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

    const pushTokens = this.user.attributes?.['pushTokens'] as string[];
    this.pushInfo = pushTokens?.map((token) => JSON.parse(token)) ?? [];

    const notifications = this.user.attributes?.['notifications'] as string[] ?? this.getDefaultNotificationSettings();
    this.notifications = Object.fromEntries(notifications.map((n) => [n, true]));

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

  copy(id: string | undefined) {
    if (!id) {
      return;
    }
    navigator.clipboard.writeText(id).then(
      () => this.toastService.success(
        $localize`:@@settings-copy-user-id:Copy User ID`,
        $localize`:@@settings-copy-user-id-success:User ID copied to clipboard`,
      ),
      err => this.toastService.error(
        $localize`:@@settings-copy-user-id:Copy User ID`,
        $localize`:@@settings-copy-user-id-error:Failed to copy User ID`,
        err,
      ),
    );
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
        next: () => this.toastService.success(
          $localize`:@@settings-push-notifications-add-device:Add Push Device`,
          $localize`:@@settings-push-notifications-add-device-success:Successfully registered device.`,
          ),
        error: error => this.toastService.error(
          $localize`:@@settings-push-notifications-add-device:Add Push Device`,
          $localize`:@@settings-push-notifications-add-device-failed-save:Failed to save user data.`,
          error,
        ),
      })
    }, error => {
      this.toastService.error(
        $localize`:@@settings-push-notifications-add-device:Add Push Device`,
        $localize`:@@settings-push-notifications-add-device-failed-register:Failed to register push device.`,
        error,
      );
    });
  }

  async removePush(info: PushInfo) {
    if (info.token.endpoint === this.existingPush?.endpoint) {
      await this.pushService.unsubscribe();
      this.existingPush = undefined;
    }

    this.pushInfo = this.pushInfo.filter((i) => i !== info);
    this.saveUser().subscribe({
      next: () => this.toastService.success(
        $localize`:@@settings-push-notifications-remove-device:Remove Push Device`,
        $localize`:@@settings-push-notifications-remove-device-success:Successfully removed device.`,
      ),
      error: error => this.toastService.error(
        $localize`:@@settings-push-notifications-remove-device:Remove Push Device`,
        $localize`:@@settings-push-notifications-remove-device-failed:Failed to remove device`,
        error,
      ),
    })
  }

  save() {
    if (!this.user) {
      return;
    }
    this.saveUser().subscribe({
      next: () => this.toastService.success(
        $localize`:@@settings-user-settings-save:Save User Settings`,
        $localize`:@@settings-user-settings-save-success:Successfully saved user settings.`,
      ),
      error: (error) => this.toastService.error(
        $localize`:@@settings-user-settings-save:Save User Settings`,
        $localize`:@@settings-user-settings-save-failed:Failed to save user settings.`,
        error,
      ),
    });
  }

  saveNotificationSettings() {
    if (!this.user) {
      return;
    }

    const notifications = Object.keys(this.notifications).filter((key) => this.notifications[key]);
    (this.user.attributes ??= {})['notifications'] = notifications;
    this.saveUser().subscribe({
      next: () => this.toastService.success(
        $localize`:@@settings-notification-preferences: Notification Preferences `,
        $localize`:@@settings-notification-preferences-success:Successfully saved notification preferences.`,
      ),
      error: error => this.toastService.error(
        $localize`:@@settings-notification-preferences: Notification Preferences `,
        $localize`:@@settings-notification-preferences-failed:Failed to save notification settings.`,
        error,
      ),
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


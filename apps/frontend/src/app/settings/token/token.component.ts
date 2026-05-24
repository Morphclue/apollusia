import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {TokenService} from '../../core/services';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
  imports: [FormsModule, NgbTooltip],
})
export class TokenComponent implements OnInit {
  private tokenService = inject(TokenService);
  private readonly toastService = inject(ToastService);

  input = '';
  visible = false;

  ngOnInit(): void {
    this.input = this.tokenService.getToken();
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.input).then(
      () => this.toastService.success(
        $localize`:@@settings-copy-token:Copy Token`,
        $localize`:@@settings-copy-token-success:Token copied to clipboard. Don't share this with others!`,
      ),
      err => this.toastService.error(
        $localize`:@@settings-copy-token:Copy Token`,
        $localize`:@@settings-copy-token-failed:Failed to copy Token to clipboard.`,
        err,
      ),
    );
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  regenerateToken() {
    this.tokenService.regenerateToken().subscribe(token => {
      this.input = token;
    });
  }

  save() {
    this.tokenService.setToken(this.input);
  }
}

import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
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
  input = '';
  visible = false;

  ngOnInit(): void {
    this.input = this.tokenService.getToken();
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.input).then().catch(e => console.log(e));
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

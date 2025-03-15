import {Component, OnInit} from '@angular/core';

import {TokenService} from '../../core/services';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
  standalone: false,
})
export class TokenComponent implements OnInit {
  input = '';
  visible = false;

  constructor(
    private tokenService: TokenService,
  ) {
  }

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

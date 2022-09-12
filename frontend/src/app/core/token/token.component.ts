import {Component, OnInit} from '@angular/core';

import {TokenService} from './token.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent implements OnInit {
  input: string = '';
  visible: boolean = false;

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
    this.tokenService.regenerateToken();
  }
}

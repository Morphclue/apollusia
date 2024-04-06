import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

import {TokenService} from '../../core/services';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent implements OnInit {
  input: string = '';
  inputChanged: Subject<string> = new Subject<string>();
  visible: boolean = false;

  constructor(
    private tokenService: TokenService,
  ) {
    this.inputChanged.pipe(
      distinctUntilChanged())
      .subscribe(() => {
        this.tokenService.setToken(this.input);
      });
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

  async regenerateToken() {
    await this.tokenService.regenerateToken();
    this.input = this.tokenService.getToken();
  }

  changed() {
    this.inputChanged.next(this.input);
  }
}

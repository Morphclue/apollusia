import {Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {TokenService} from '../services/token.service';

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
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(() => {
        this.tokenService.setToken(this.input);
        window.location.reload();
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

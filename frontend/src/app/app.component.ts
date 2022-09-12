import {Component, OnInit} from '@angular/core';
import {TokenService} from './core/token/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'apollusia';

  constructor(private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.tokenService.getToken();
  }
}

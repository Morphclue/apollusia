import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {Poll} from '../../model/poll';
import {TokenService} from '../token/token.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  polls: Poll[] = [];

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
    console.log(this.tokenService.getToken());
    this.http.get<Poll[]>(`${environment.backendURL}/poll`).subscribe((data: Poll[]) => {
      this.polls = [...this.polls, ...data];
    });
  }
}

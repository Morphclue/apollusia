import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {TokenService} from '../../core/services';
import {Poll} from '../../model';

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
    this.http.get<Poll[]>(`${environment.backendURL}/poll/all/${this.tokenService.getToken()}`).subscribe((data: Poll[]) => {
      this.polls = [...this.polls, ...data];
    });
  }
}

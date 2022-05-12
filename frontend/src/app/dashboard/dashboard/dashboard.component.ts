import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {Poll} from '../../model/poll';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  polls: Poll[] = [];

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.http.get<Poll[]>(`${environment.backendURL}/poll`).subscribe((data: Poll[]) => {
      this.polls = [...this.polls, ...data];
    });
  }
}

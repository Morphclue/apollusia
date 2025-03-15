import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';

import {environment} from '../../../environments/environment';
import {Statistics} from '../../model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  standalone: false,
})
export class StatisticsComponent implements OnInit {
  statistics?: Statistics;

  columns: [keyof Statistics, string, string][] = [
    ['polls', 'bi-calendar', 'Polls created'],
    ['pollEvents', 'bi-calendar-week', 'Events created'],
    ['participants', 'bi-person-check', 'Persons participated'],
    ['users', 'bi-person', 'Unique Users'],
  ];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchStatistics();
  }

  private fetchStatistics() {
    this.http.get<Statistics>(`${environment.backendURL}/stats`).subscribe((stats: Statistics) => {
      this.statistics = stats;
    });
  }
}

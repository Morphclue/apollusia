import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Statistics} from '../../model';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  statistics?: Statistics;

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

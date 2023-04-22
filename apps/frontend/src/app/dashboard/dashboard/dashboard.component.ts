import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';

import {environment} from '../../../environments/environment';
import {TokenService} from '../../core/services';
import {ReadPoll} from '../../model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentAdminPolls: ReadPoll[] = [];
  oldAdminPolls: ReadPoll[] = [];
  participantPolls: ReadPoll[] = [];

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
    this.http.get<ReadPoll[]>(`${environment.backendURL}/poll/all/${this.tokenService.getToken()}`).subscribe((data: ReadPoll[]) => {
      const now = new Date();
      const adminPolls = data.filter(p => p.isAdmin);
      this.currentAdminPolls = adminPolls.filter(p => !p.settings.deadline || now < new Date(p.settings.deadline));
      this.oldAdminPolls = adminPolls.filter(p => p.settings.deadline && now >= new Date(p.settings.deadline));
      this.participantPolls = data.filter(p => !p.isAdmin);
    });
  }
}

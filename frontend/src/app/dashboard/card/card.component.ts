import {HttpClient} from '@angular/common/http';
import {Component, Input, OnInit} from '@angular/core';

import {environment} from '../../../environments/environment';
import {TokenService} from '../../core/services';
import {ReadPoll} from '../../model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() poll: ReadPoll | undefined;
  isAdmin: boolean = false;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
    this.checkAdmin();
  }

  private checkAdmin() {
    if (!this.poll) {
      return;
    }
    const adminToken = this.tokenService.getToken();
    this.http.get<boolean>(`${environment.backendURL}/poll/${this.poll._id}/admin/${adminToken}`).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}

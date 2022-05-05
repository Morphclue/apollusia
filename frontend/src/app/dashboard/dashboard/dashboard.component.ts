import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PollDto} from "../../dto/poll.dto";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  polls: PollDto[] = [];

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    console.log("Test")
    this.http.get<PollDto[]>(`${environment.backendURL}/poll`).subscribe((data: PollDto[]) => {
      this.polls = [...this.polls, ...data];
    });
  }
}

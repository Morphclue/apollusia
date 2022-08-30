import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {format} from 'date-fns';

import {Poll} from '../../model/poll';
import {environment} from '../../../environments/environment';
import {Participant} from '../../model/participant';
import {CalendarEvent} from 'angular-calendar';

@Component({
  selector: 'app-choose-events',
  templateUrl: './choose-events.component.html',
  styleUrls: ['./choose-events.component.scss'],
})
export class ChooseEventsComponent implements OnInit {
  id: string = '';
  pollEvents: any[] = [];
  checks: boolean[] = [];
  participateForm = new FormGroup({
    name: new FormControl('', Validators.required),
    // TODO: add checks as FormArray
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

  onFormSubmit() {
    let participant: Participant = {
      name: 'example',
      participation: this.checks,
    };

    this.http.post(`${environment.backendURL}/poll/${this.id}/participate`, participant).subscribe(() => {
      window.location.reload();
    });
  }

  checked(n: number) {
    this.checks[n] = !this.checks[n];
  }

  private fetchEvents() {
    this.http.get<Poll>(`${environment.backendURL}/poll/${this.id}`).subscribe(poll => {
      if (!poll.events) {
        return;
      }

      this.checks = new Array(poll.events.length).fill(false);
      this.fillPollEvents(poll.events);
    });
  }

  private fillPollEvents(events: CalendarEvent[]) {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (!event.end) {
        return;
      }
      this.pollEvents.push({
        weekday: format(new Date(event.start), 'E'),
        day: format(new Date(event.start), 'd'),
        month: format(new Date(event.start), 'MMM'),
        startTime: format(new Date(event.start), 'HH:mm'),
        endTime: format(new Date(event.end), 'HH:mm'),
      });
    }
  }
}

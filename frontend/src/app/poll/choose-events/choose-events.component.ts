import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {format} from 'date-fns';

import {Poll} from '../../model/poll';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-choose-events',
  templateUrl: './choose-events.component.html',
  styleUrls: ['./choose-events.component.scss'],
})
export class ChooseEventsComponent implements OnInit {
  id: string = '';
  poll?: Poll;
  pollEvents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    this.http.get<Poll>(`${environment.backendURL}/poll/${this.id}`).subscribe(poll => {
      this.poll = poll;
      if (!poll.events) {
        return;
      }

      for (const event of poll.events) {
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
    });
  }
}

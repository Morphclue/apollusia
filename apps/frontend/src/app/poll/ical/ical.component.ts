import {DatePipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormsModule, ModalModule} from '@mean-stream/ngbx';
import {saveAs} from 'file-saver';
import {ICalCalendar, ICalCalendarMethod} from 'ical-generator';
import {forkJoin} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';

import {ICalConfig} from './ical-config';
import {MarkdownService} from '../../core/services/markdown.service';
import {Participant, ReadPoll, ReadPollEvent} from '../../model';
import {PollService} from '../services/poll.service';

@Component({
  selector: 'apollusia-ical',
  templateUrl: './ical.component.html',
  styleUrl: './ical.component.scss',
  imports: [
    ModalModule,
    FormsModule,
    RouterLink,
    DatePipe,
  ],
})
export class IcalComponent implements OnInit {
  public route = inject(ActivatedRoute);
  private pollService = inject(PollService);
  private markdownService = inject(MarkdownService);
  poll?: ReadPoll;
  pollEvents?: ReadPollEvent[];
  participants?: Participant[];
  url: string;

  exampleEvent?: ReadPollEvent & {_participants: Participant[]};

  config = new ICalConfig();

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({id}) => forkJoin([
        this.pollService.get(id).pipe(tap((poll) => this.poll = poll)),
        this.pollService.getEvents(id).pipe(tap(events => this.pollEvents = events)),
        this.pollService.getParticipants(id).pipe(tap(participants => this.participants = participants)),
      ])),
    ).subscribe(([poll, events, participants]) => {
      this.url = new URL(`/poll/${poll.id}/participate`, window.location.origin).href;
      this.config.onlyBookedEvents = Object.keys(poll.bookedEvents).length > 0;

      const exampleEvent = events.find(e => e.participants > 0) ?? events[0];
      this.exampleEvent = {
        ...exampleEvent,
        _participants: exampleEvent.participants === 0 ? participants : participants.filter(p => p.selection[exampleEvent._id] === 'yes' || p.selection[exampleEvent._id] === 'maybe'),
      };
    });
  }

  export() {
    const {url, participants, poll, pollEvents, config} = this;
    if (!poll || !pollEvents || !participants) {
      return;
    }

    const calendar = new ICalCalendar({
      name: poll.title,
      description: poll.description,
      url,
      timezone: poll.timeZone,
      method: ICalCalendarMethod.REQUEST,
    });

    for (const event of this.getExportedEvents()) {
      const eventParticipants = participants.filter(p => {
        if (p.selection[event._id] !== 'yes' && p.selection[event._id] !== 'maybe') {
          return false;
        }
        const bookedEvent = poll.bookedEvents[event._id];
        if (config.onlyBookedEvents && Array.isArray(bookedEvent) && !bookedEvent.includes(p._id)) {
          return false;
        }
        return true;
      });

      let summary = config.customTitle || poll.title;
      if (eventParticipants.length === 1) {
        summary += `: ${eventParticipants[0].name}`;
      }

      let description = poll.description ?? '';
      if (event.note) {
        description += `\n\nNote: ${event.note}`;
      }
      description += `\n\nParticipants:\n${eventParticipants.map(p => `- ${p.name} (${p.selection[event._id]})`).join('\n')}`;

      calendar.createEvent({
        id: event._id,
        timezone: poll.timeZone,
        start: new Date(event.start),
        end: new Date(event.end),
        summary,
        description: {
          plain: description,
          html: this.markdownService.render(description),
        },
        location: poll.location,
        url,
      });
    }

    saveAs(new Blob([calendar.toString()], {type: 'text/calendar'}), `${poll.title}.ics`);
  }

  getExportedEvents(): ReadPollEvent[] {
    return this.pollEvents?.filter(e => {
      if (!this.config.emptyEvents && !e.participants) {
        return false;
      }
      if (this.config.onlyBookedEvents && !this.poll?.bookedEvents[e._id]) {
        return false;
      }
      return true;
    }) ?? [];
  }
}

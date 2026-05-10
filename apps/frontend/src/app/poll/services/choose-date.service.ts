import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';
import {addDays, addMinutes, endOfDay, format, startOfDay} from 'date-fns';

import {environment} from '../../../environments/environment';
import {PollEvent} from '../../model';

interface ChooseDateEventMeta {
  tmpEvent?: boolean;
  note?: string;
}

@Injectable()
export class ChooseDateService {
  events: CalendarEvent<ChooseDateEventMeta>[] = [];
  autofillEvent?: CalendarEvent<ChooseDateEventMeta>;
  private http = inject(HttpClient);

  floorToNearest(amount: number, precision: number): number {
    return Math.floor(amount / precision) * precision;
  }

  ceilToNearest(amount: number, precision: number): number {
    return Math.ceil(amount / precision) * precision;
  }

  createDragSelectEvent(segment: WeekViewHourSegment): CalendarEvent<ChooseDateEventMeta> {
    const dragToSelectEvent: CalendarEvent<ChooseDateEventMeta> = {
      title: `${format(segment.date, 'HH:mm')}`,
      start: segment.date,
      allDay: false,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    return dragToSelectEvent;
  }

  calculateNewEnd(segment: WeekViewHourSegment, segmentElement: HTMLElement, mouseMoveEvent: any, length: number): Date {
    const segmentPosition = segmentElement.getBoundingClientRect();
    const minutesDifference = this.ceilToNearest(
      (mouseMoveEvent.clientY - segmentPosition.top) / 2,
      length,
    );

    const daysDifference =
      this.floorToNearest(
        mouseMoveEvent.clientX - segmentPosition.left,
        segmentPosition.width,
      ) / segmentPosition.width;

    return addDays(addMinutes(segment.date, minutesDifference), daysDifference);
  }

  deleteEvent(event: CalendarEvent): void {
    this.events = this.events.filter(e => e !== event);
  }

  updateEvents(id: string) {
    this.http.get<PollEvent[]>(`${environment.backendURL}/poll/${id}/events`).subscribe(events => {
      if (!events) {
        return;
      }

      this.events = events.map((event: PollEvent) => this.createEvent(
        new Date(event.start),
        event.end ? new Date(event.end) : new Date(event.start),
        event.note,
        event.allDay,
        event._id,
      ));
    });
  }

  addEvent(start: Date, end: Date, note?: string, allDay = false) {
    this.events = [...this.events, this.createEvent(start, end, note, allDay)];
  }

  updateEventTime(event: CalendarEvent<ChooseDateEventMeta>, start: Date, end: Date, allDay = false) {
    if (allDay) {
      event.start = startOfDay(start);
      event.end = endOfDay(end);
    } else {
      event.start = start;
      event.end = end;
    }
    event.allDay = allDay;
    event.title = this.getEventTitle(event);
  }

  toggleAllDay(event: CalendarEvent<ChooseDateEventMeta>, timedDurationInMinutes: number) {
    if (event.allDay) {
      const start = new Date(event.start);
      start.setHours(12, 0, 0, 0);
      this.updateEventTime(event, start, addMinutes(start, timedDurationInMinutes), false);
      return;
    }

    this.updateEventTime(event, event.start, event.end ?? event.start, true);
  }

  private createEvent(start: Date, end: Date, note?: string, allDay = false, id?: string) {
    const event: CalendarEvent<ChooseDateEventMeta> = {
      id,
      start,
      end,
      draggable: true,
      allDay,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      meta: {
        tmpEvent: true,
        note,
      },
      title: '',
    };
    this.updateEventTime(event, start, end, allDay);
    return event;
  }

  private getEventTitle(event: CalendarEvent<ChooseDateEventMeta>) {
    return event.allDay ? 'All day' : `${format(event.start, 'HH:mm')} - ${format(event.end!, 'HH:mm')}`;
  }

  postpone(postponeDays: number) {
    this.events = this.events.map(event => ({
      ...event,
      start: addDays(event.start, postponeDays),
      end: addDays(event.end!, postponeDays),
      title: this.getEventTitle({
        ...event,
        start: addDays(event.start, postponeDays),
        end: addDays(event.end!, postponeDays),
      }),
    }));
  }
}

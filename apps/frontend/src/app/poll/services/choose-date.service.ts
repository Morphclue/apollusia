import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';
import {addDays, addMinutes, format} from 'date-fns';

import {environment} from '../../../environments/environment';
import {PollEvent} from '../../model';

@Injectable()
export class ChooseDateService {
  events: CalendarEvent[] = [];
  autofillEvent?: CalendarEvent;

  constructor(private http: HttpClient) {
  }

  floorToNearest(amount: number, precision: number): number {
    return Math.floor(amount / precision) * precision;
  }

  ceilToNearest(amount: number, precision: number): number {
    return Math.ceil(amount / precision) * precision;
  }

  createDragSelectEvent(segment: WeekViewHourSegment): CalendarEvent {
    const dragToSelectEvent: CalendarEvent = {
      title: `${format(segment.date, 'HH:mm')}`,
      start: segment.date,
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

      this.events = events.map((event: PollEvent) => {
        const startDate: Date = new Date(event.start);
        const endDate: Date = event.end ? new Date(event.end) : new Date();

        return {
          id: event._id,
          title: `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          meta: {
            tmpEvent: true,
            note: event.note,
          },
          start: startDate,
          end: endDate,
        };
      });
    });
  }

  addEvent(start: Date, end: Date, note?: string) {
    this.events = [...this.events, {
      title: `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
      start: start,
      end: end,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      meta: {
        tmpEvent: true,
        note,
      },
    }];
  }

  postpone(postponeDays: number) {
    this.events = this.events.map(event => ({
      ...event,
      start: addDays(event.start, postponeDays),
      end: addDays(event.end!, postponeDays),
    }));
  }
}

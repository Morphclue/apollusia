import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CalendarEvent, CalendarEventAction} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';
import {addDays, addMinutes} from 'date-fns';

import {Poll, PollEvent} from '../../model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChooseDateService {
  events: CalendarEvent[] = [];
  actions: CalendarEventAction[] = [
    {
      label: '<i class="bi bi-x-lg"></i>',
      onClick: ({event}: { event: CalendarEvent }): void => {
        this.deleteEvent(event);
      },
    },
  ];

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
      title: '',
      start: segment.date,
      actions: this.actions,
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

  calculateNewEnd(segment: WeekViewHourSegment, segmentElement: HTMLElement, mouseMoveEvent: any): Date {
    const segmentPosition = segmentElement.getBoundingClientRect();
    let minutesDifference = this.ceilToNearest(
      mouseMoveEvent.clientY - segmentPosition.top,
      30,
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
    this.http.get<Poll>(`${environment.backendURL}/poll/${id}`).subscribe((poll: Poll) => {
      if (!poll.events) {
        return;
      }

      this.events = poll.events.map((event: PollEvent) => {
        const startDate: Date = new Date(event.start);
        const endDate: Date = event.end ? new Date(event.end) : new Date();

        return {
          id: event._id,
          title: '',
          actions: this.actions,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          meta: {
            tmpEvent: true,
          },
          start: startDate,
          end: endDate,
        };
      });
    });
  }

  addEvent(start: Date, end: Date) {
    this.events = [...this.events, {
      title: '',
      start,
      end,
      actions: this.actions,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      meta: {
        tmpEvent: true,
      },
    }];
  }
}

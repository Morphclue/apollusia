import {Injectable} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';

@Injectable({
  providedIn: 'root',
})
export class ChooseDateService {

  events: CalendarEvent[] = [];

  constructor() {
  }

  floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
  }

  ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / precision) * precision;
  }

  createDragSelectEvent(segment: WeekViewHourSegment) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event: ' + this.events.length.toString(),
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    return dragToSelectEvent;
  }
}

import {Injectable} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';
import {addDays, addMinutes} from 'date-fns';

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
}

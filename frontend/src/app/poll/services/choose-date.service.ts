import {Injectable} from '@angular/core';
import {CalendarEvent, CalendarEventAction} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';
import {addDays, addMinutes} from 'date-fns';

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

  constructor() {
  }

  floorToNearest(amount: number, precision: number): number {
    return Math.floor(amount / precision) * precision;
  }

  ceilToNearest(amount: number, precision: number): number {
    return Math.ceil(amount / precision) * precision;
  }

  createDragSelectEvent(segment: WeekViewHourSegment): CalendarEvent {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event: ' + this.events.length.toString(),
      start: segment.date,
      actions: this.actions,
      draggable: true,
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
}

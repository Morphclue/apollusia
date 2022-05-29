import {ChangeDetectorRef, Component} from '@angular/core';
import {WeekViewHourSegment} from 'calendar-utils';
import {fromEvent} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {endOfWeek} from 'date-fns';

import {ChooseDateService} from '../services/choose-date.service';

@Component({
  selector: 'app-choose-date',
  templateUrl: './choose-date.component.html',
  styleUrls: ['./choose-date.component.scss'],
})
export class ChooseDateComponent {

  viewDate = new Date();
  dragToCreateActive = true;
  weekStartsOn: 1 = 1;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private chooseDateService: ChooseDateService,
  ) {
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement,
  ) {
    const dragToSelectEvent = this.chooseDateService.createDragSelectEvent(segment);
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refresh();
        }),
        takeUntil(fromEvent(document, 'mouseup')),
      )
      .subscribe((mouseMoveEvent: any) => {
        const newEnd = this.chooseDateService.calculateNewEnd(segment, segmentElement, mouseMoveEvent);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh();
      });
  }

  refresh() {
    this.chooseDateService.events = [...this.chooseDateService.events];
    this.changeDetectorRef.detectChanges();
  }

  getEvents() {
    return this.chooseDateService.events;
  }
}

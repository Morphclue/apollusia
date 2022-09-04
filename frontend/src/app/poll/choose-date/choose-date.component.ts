import {AfterViewInit, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {WeekViewHourSegment} from 'calendar-utils';
import {fromEvent, Observable} from 'rxjs';
import {finalize, map, takeUntil} from 'rxjs/operators';
import {addMinutes, differenceInMinutes, endOfWeek} from 'date-fns';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';

import {ChooseDateService} from '../services/choose-date.service';
import {environment} from '../../../environments/environment';
import {PollEvent} from '../../model/poll-event';

@Component({
  selector: 'app-choose-date',
  templateUrl: './choose-date.component.html',
  styleUrls: ['./choose-date.component.scss'],
})
export class ChooseDateComponent implements AfterViewInit {
  viewDate = new Date();
  dragToCreateActive = true;
  weekStartsOn: 1 = 1;
  previousEventDuration = 30;
  id: string = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private chooseDateService: ChooseDateService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
      this.chooseDateService.updateEvents(id);
    });
  }

  ngAfterViewInit() {
    this.scrollToCurrentTime();
  }

  scrollToCurrentTime() {
    const selector = '.cal-current-time-marker';
    setTimeout(() => {
      this.elementRef.nativeElement.querySelector(selector).scrollIntoView();
    });
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement,
  ) {
    if (mouseDownEvent.button != 0) {
      return;
    }

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
          this.previousEventDuration = differenceInMinutes(dragToSelectEvent.end, dragToSelectEvent.start);
        }
        this.refresh();
      });

    if (!dragToSelectEvent.end) {
      dragToSelectEvent.end = addMinutes(dragToSelectEvent.start, this.previousEventDuration);
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh();
  }

  refresh() {
    this.chooseDateService.events = [...this.chooseDateService.events];
    this.changeDetectorRef.detectChanges();
  }

  getEvents() {
    return this.chooseDateService.events;
  }

  createEvents() {
    const events: PollEvent[] = this.chooseDateService.events.map((event: CalendarEvent) => {
      return {_id: event.id?.toString(), title: event.title, start: event.start, end: event.end};
    });
    this.http.post(`${environment.backendURL}/poll/${this.id}/events`, events).subscribe(() => {
      this.router.navigate(['dashboard']).then(
        // TODO: fallback logic
      );
    });
  }
}

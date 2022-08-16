import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {WeekViewHourSegment} from 'calendar-utils';
import {fromEvent, Observable} from 'rxjs';
import {finalize, map, takeUntil} from 'rxjs/operators';
import {addMinutes, differenceInMinutes, endOfWeek, startOfDay, startOfHour} from 'date-fns';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';

import {ChooseDateService} from '../services/choose-date.service';
import {environment} from '../../../environments/environment';
import {Event} from '../../model/event';

@Component({
  selector: 'app-choose-date',
  templateUrl: './choose-date.component.html',
  styleUrls: ['./choose-date.component.scss'],
})
export class ChooseDateComponent implements AfterViewInit {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;
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
    this.scrollContainer.nativeElement.scrollTop = differenceInMinutes(
      startOfHour(new Date()),
      startOfDay(new Date()),
    );
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
    const events: Event[] = this.chooseDateService.events.map((event: CalendarEvent) => {
      return {eventId: event.id, title: event.title, start: event.start, end: event.end};
    });
    this.http.post(`${environment.backendURL}/poll/${this.id}/events`, events).subscribe(() => {
      this.router.navigate(['dashboard']).then(
        // TODO: fallback logic
      );
    });
  }
}

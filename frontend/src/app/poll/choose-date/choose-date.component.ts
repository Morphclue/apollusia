import {AfterViewInit, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {WeekViewHourSegment} from 'calendar-utils';
import {fromEvent, Observable} from 'rxjs';
import {finalize, map, takeUntil} from 'rxjs/operators';
import {addMinutes, differenceInMinutes, endOfWeek, format} from 'date-fns';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ChooseDateService} from '../services/choose-date.service';
import {environment} from '../../../environments/environment';
import {PollEvent} from '../../model';

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
  initialModalFormValues: any;
  modalForm = new FormGroup({
    dates: new FormControl('', Validators.required),
    startTime: new FormControl('12:00', Validators.required),
    duration: new FormControl('00:30', Validators.required),
    pause: new FormControl('00:00', Validators.required),
    repeat: new FormControl(1, Validators.required),
  });

  constructor(
    private modalService: NgbModal,
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
    this.initialModalFormValues = this.modalForm.value;
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
    dragToSelectEvent.title = `${dragToSelectEvent.title} - ${format(dragToSelectEvent.end, 'HH:mm')}`;
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    if (!newEnd) {
      return;
    }

    event.start = newStart;
    event.end = newEnd;
    event.title = `${format(newStart, 'HH:mm')} - ${format(newEnd, 'HH:mm')}`;
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
      return {_id: event.id?.toString(), start: event.start, end: event.end};
    });
    this.http.post(`${environment.backendURL}/poll/${this.id}/events`, events).subscribe(() => {
      this.router.navigate(['dashboard']).then();
    });
  }

  hasEvents() {
    return this.chooseDateService.events.length > 0;
  }

  open(content: any) {
    this.modalService.open(content).result.then(() => {
      this.onFormSubmit();
      this.modalForm.reset(this.initialModalFormValues);
    }).catch(() => {
    });
  }

  onFormSubmit() {
    if (!this.modalForm.valid) {
      return;
    }

    const dateValue = this.modalForm.get('dates')?.value;
    const startTimeValue = this.modalForm.get('startTime')?.value;
    const durationValue = this.modalForm.get('duration')?.value;
    const pauseValue = this.modalForm.get('pause')?.value;
    const repeat = this.modalForm.get('repeat')?.value;

    if (!dateValue || !repeat || !startTimeValue || !durationValue || !pauseValue) {
      return;
    }

    const dates = dateValue.split(',');
    const startTime = startTimeValue.split(':').map((value: string) => parseInt(value));
    const duration = durationValue.split(':').map((value: string) => parseInt(value));
    const pause = pauseValue.split(':').map((value: string) => parseInt(value));

    for (let i = 0; i < dates.length; i++) {
      let start = new Date(dates[i]);
      start.setHours(startTime[0], startTime[1], 0, 0);
      let end = new Date(start);
      end = addMinutes(end, duration[0] * 60 + duration[1]);
      this.chooseDateService.addEvent(start, end);
      for (let j = 0; j < repeat - 1; j++) {
        start = new Date(end);
        start = addMinutes(start, pause[0] * 60 + pause[1]);
        end = new Date(start);
        end = addMinutes(end, duration[0] * 60 + duration[1]);
        this.chooseDateService.addEvent(start, end);
      }
    }
  }
}

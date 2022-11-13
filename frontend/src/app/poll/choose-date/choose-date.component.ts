import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, TemplateRef} from '@angular/core';
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
  previousEventDuration = 15;
  id: string = '';
  note: string = '';
  noteEvent?: CalendarEvent = undefined;

  constructor(
    private modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef,
    private chooseDateService: ChooseDateService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
  ) {
    const routeId: Observable<string> = route.params.pipe(map(p => p.id));
    routeId.subscribe((id: string) => {
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
    if (mouseDownEvent.button !== 0) {
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
        this.updateTime(dragToSelectEvent);
        this.refresh();
      });

    if (!dragToSelectEvent.end) {
      dragToSelectEvent.end = addMinutes(dragToSelectEvent.start, this.previousEventDuration);
    }
    this.updateTime(dragToSelectEvent);
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
    const events: PollEvent[] = this.chooseDateService.events.map((event: CalendarEvent) => ({_id: event.id?.toString(), start: event.start, end: event.end, note: event.meta.note}));
    this.http.post(`${environment.backendURL}/poll/${this.id}/events`, events).subscribe(() => {
      this.router.navigate([`poll/${this.id}/participate`]).then();
    });
  }

  hasEvents() {
    return this.chooseDateService.events.length > 0;
  }

  deleteEvent(event: CalendarEvent) {
    this.chooseDateService.deleteEvent(event);
  }

  openNoteModal(content: TemplateRef<any>, event: CalendarEvent) {
    this.noteEvent = event;
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  addNote() {
    if (!this.noteEvent) {
      return;
    }

    this.noteEvent.meta.note = this.note;
    this.note = '';
    this.noteEvent = undefined;
    this.modalService.dismissAll();
  }

  deleteNote(event: CalendarEvent) {
    event.meta.note = undefined;
  }

  autofill(event: CalendarEvent) {
    this.chooseDateService.autofillEvent = event;
    this.router.navigate(['autofill'], {relativeTo: this.activatedRoute}).then();
  }

  private updateTime(event: CalendarEvent) {
    event.title = `${format(event.start, 'HH:mm')} - ${format(event.end!, 'HH:mm')}`;
  }
}

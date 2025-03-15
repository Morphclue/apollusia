import {HttpClient} from '@angular/common/http';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {WeekViewHourSegment} from 'calendar-utils';
import {addMinutes, differenceInMinutes, endOfWeek, format} from 'date-fns';
import {fromEvent} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {CreatePollEventDto} from '../../model';
import {ChooseDateService} from '../services/choose-date.service';

@Component({
  selector: 'app-choose-date',
  templateUrl: './choose-date.component.html',
  styleUrls: ['./choose-date.component.scss'],
  providers: [ChooseDateService],
  standalone: false,
})
export class ChooseDateComponent implements AfterViewInit {
  viewDate = new Date();
  dragToCreateActive = true;
  weekStartsOn = 1 as const;
  previousEventDuration = 15;
  id = '';
  note = '';
  noteEvent?: CalendarEvent;
  disabledBefore = Date.now() - 15 * 60 * 1000;
  segments = 4;

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
    route.params.subscribe(({id}) => {
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
        const newEnd = this.chooseDateService.calculateNewEnd(segment, segmentElement, mouseMoveEvent, 60 / this.segments);
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

  saveEvents() {
    const events: CreatePollEventDto[] = this.chooseDateService.events.map((event: CalendarEvent) => ({
      _id: event.id?.toString(),
      start: event.start.toISOString(),
      end: event.end!.toISOString(),
      note: event.meta.note,
    }));
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

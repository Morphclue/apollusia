import { Component, inject, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {addMinutes, format} from 'date-fns';

import {ChooseDateService} from '../../poll/services/choose-date.service';

@Component({
  selector: 'app-autofill-modal',
  templateUrl: './autofill-modal.component.html',
  styleUrls: ['./autofill-modal.component.scss'],
  standalone: false,
})
export class AutofillModalComponent implements OnInit {
  private chooseDateService = inject(ChooseDateService);
  selectedDates: NgbDate[] = [];
  modalForm = new FormGroup({
    dates: new FormControl('', Validators.required),
    startTime: new FormControl('12:00', Validators.required),
    duration: new FormControl('00:15', Validators.required),
    pause: new FormControl('00:00', Validators.required),
    repeat: new FormControl(1, Validators.required),
    note: new FormControl(''),
  });
  endTime: string = '';

  ngOnInit(): void {
    this.updateEnd();
    this.modalForm.valueChanges.subscribe(() => this.updateEnd());

    const event = this.chooseDateService.autofillEvent;
    if (!event || !event.end) {
      return;
    }

    const day = format(event.start, 'yyyy-MM-dd');
    const ngbDate = new NgbDate(
      parseInt(day.split('-')[0], 10),
      parseInt(day.split('-')[1], 10),
      parseInt(day.split('-')[2], 10),
    );

    this.onDateSelect(ngbDate);
    this.chooseDateService.autofillEvent = undefined;
  }

  updateEnd() {
    const startTimeValue = this.modalForm.get('startTime')?.value;
    const durationValue = this.modalForm.get('duration')?.value;
    const pauseValue = this.modalForm.get('pause')?.value;
    const repeat = this.modalForm.get('repeat')?.value;

    if (!startTimeValue || !durationValue || !pauseValue || !repeat) {
      this.endTime = '';
      return;
    }

    const startTime = startTimeValue.split(':').map((value: string) => parseInt(value, 10));

    const start = new Date().setHours(startTime[0], startTime[1], 0, 0);
    const duration = this.parseMinutes(durationValue);
    const pause = this.parseMinutes(pauseValue);

    this.endTime = format(addMinutes(start, duration + (duration + pause) * (repeat - 1)), 'HH:mm');
  }

  apply() {
    if (!this.modalForm.valid) {
      return;
    }

    const dateValue = this.modalForm.get('dates')?.value;
    const startTimeValue = this.modalForm.get('startTime')?.value;
    const durationValue = this.modalForm.get('duration')?.value;
    const pauseValue = this.modalForm.get('pause')?.value;
    const repeat = this.modalForm.get('repeat')?.value;
    const note = this.modalForm.get('note')?.value ?? undefined;

    if (!dateValue || !repeat || !startTimeValue || !durationValue || !pauseValue) {
      return;
    }

    const dates = dateValue.split(',');
    const startTime = startTimeValue.split(':').map((value: string) => parseInt(value, 10));
    const duration = this.parseMinutes(durationValue);
    const pause = this.parseMinutes(pauseValue);

    for (const item of dates) {
      let start = new Date(item);
      start.setHours(startTime[0], startTime[1], 0, 0);
      let end = new Date(start);
      end = addMinutes(end, duration);
      this.chooseDateService.addEvent(start, end, note);
      for (let j = 0; j < repeat - 1; j++) {
        start = new Date(end);
        start = addMinutes(start, pause);
        end = new Date(start);
        end = addMinutes(end, duration);
        this.chooseDateService.addEvent(start, end, note);
      }
    }
  }

  private parseMinutes(value: string): number {
    const values = value.split(':');
    return parseInt(values[0], 10) * 60 + parseInt(values[1], 10);
  }

  onDateSelect(date: NgbDate) {
    if (this.isSelected(date)) {
      this.selectedDates = this.selectedDates.filter((d: NgbDate) => !d.equals(date));
      return;
    }

    this.selectedDates.push(date);
    this.fillDates();
  }

  isSelected(date: NgbDate) {
    return this.selectedDates.some((d: NgbDate) => d.equals(date));
  }

  private fillDates() {
    const dates: Date[] = this.selectedDates.map((date: NgbDate) => new Date(date.year, date.month - 1, date.day));
    this.modalForm.get('dates')?.setValue(dates.map((date: Date) => format(date, 'yyyy-MM-dd')).join(','));
  }
}

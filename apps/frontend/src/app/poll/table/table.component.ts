import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  input,
  model
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {checkParticipant} from '@apollusia/logic';
import type {PollEventState} from '@apollusia/types';
import {ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {
  CreateParticipantDto,
  Participant,
  Poll,
  ReadPoll,
  ReadPollEvent,
  UpdateParticipantDto
} from '../../model';
import {SomePipe} from '../../pipes/some.pipe';
import {CheckButtonComponent} from '../check-button/check-button.component';
import {EventHeadComponent} from '../event-head/event-head.component';
import {ParticipantInfoComponent} from '../participant-info/participant-info.component';
import {PollService} from '../services/poll.service';

@Component({
  selector: 'apollusia-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  imports: [
    EventHeadComponent,
    FormsModule,
    CheckButtonComponent,
    NgbTooltip,
    ParticipantInfoComponent,
    SomePipe,
  ],
})
export class TableComponent implements OnInit {
  readonly poll = input<ReadPoll>();
  readonly pollEvents = input<ReadPollEvent[]>([]);
  readonly participants = model<Participant[]>([]);
  readonly isAdmin = input<boolean>(false);
  readonly canParticipate = input<boolean>(false);
  readonly token = input<string>();
  readonly bestOption = input<number>(1);
  @Output() changed = new EventEmitter<void>();
  protected pollService = inject(PollService);
  private toastService = inject(ToastService);

  bookedEvents: Poll['bookedEvents'] = {};

  newParticipant: CreateParticipantDto = {
    name: '',
    selection: {},
    token: '',
  };
  editParticipant?: Participant;
  editDto?: UpdateParticipantDto;
  errors: string[] = [];

  ngOnInit() {
    this.bookedEvents = this.poll()?.bookedEvents || {};
    this.newParticipant.token = this.token() || '';
    this.clearSelection();
    this.validateNew();
  }

  submit() {
    this.pollService.participate(this.poll()!._id, this.newParticipant).subscribe(participant => {
      this.participants().unshift(participant);
      this.poll()!.participants++;
      this.onChange();
      this.clearSelection();
    }, error => {
      this.toastService.error('Submit', 'Failed to submit your participation', error);
    });
  }

  setEditParticipant(participant: Participant) {
    this.editParticipant = participant;
    this.editDto = {
      selection: {...participant.selection},
    };
    this.validateEdit();
  }

  cancelEdit() {
    this.editParticipant = undefined;
  }

  confirmEdit() {
    if (!this.editParticipant || !this.editDto) {
      return;
    }

    this.pollService.editParticipant(this.poll()!._id, this.editParticipant._id, this.editDto).subscribe(participant => {
      this.cancelEdit();
      this.participants.set(this.participants().map(p => p._id === participant._id ? participant : p));
      this.onChange();
    });
  }

  deleteParticipation(participantId: string) {
    this.pollService.deleteParticipant(this.poll()!._id, participantId).subscribe(() => {
      this.participants.set(this.participants().filter(p => p._id !== participantId));
      this.poll()!.participants--;
      this.onChange();
    });
  }

  validateNew() {
    this.errors = checkParticipant(this.newParticipant, this.poll()!, this.participants());
  }

  validateEdit() {
    this.errors = checkParticipant(this.editDto!, this.poll()!, this.participants(), this.editParticipant!._id);
  }

  clearSelection() {
    this.newParticipant.name = this.poll()!.settings.anonymous ? 'Anonymous' : '';
    this.selectAll('no');
  }

  selectAll(state: PollEventState = 'yes') {
    this.pollService.selectAll(this.poll()!, this.pollEvents(), this.newParticipant, state);
  }

  setBooked(eventId: string, state: boolean) {
    if (state) {
      this.bookedEvents[eventId] = true;
    } else {
      delete this.bookedEvents[eventId];
    }
  }

  book() {
    this.pollService.book(this.poll()!._id, this.bookedEvents).subscribe(() => {
      this.toastService.success('Booking', 'Booked events successfully');
    });
  }

  private onChange() {
    this.changed.next();
  }

  setBookedParticipant(eventId: string, participantId: string, state: boolean) {
    const original = Array.isArray(this.bookedEvents[eventId]) ? this.bookedEvents[eventId] as string[] : [];
    if (state) {
      this.bookedEvents[eventId] = [...original, participantId];
    } else {
      this.bookedEvents[eventId] = original.filter(id => id !== participantId);
    }
  }
}

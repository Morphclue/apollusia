import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {checkParticipant} from "@apollusia/logic";
import {ShowResultOptions} from "@apollusia/types/lib/schema/show-result-options";
import {ToastService} from "@mean-stream/ngbx";

import {CreateParticipantDto, Participant, ReadPoll, ReadPollEvent, UpdateParticipantDto} from "../../model";
import {PollService} from "../services/poll.service";

@Component({
  selector: 'apollusia-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  protected readonly ShowResultOptions = ShowResultOptions;

  @Input() poll: ReadPoll;
  @Input() pollEvents: ReadPollEvent[] = [];
  @Input() participants: Participant[] = [];
  @Input() isAdmin: boolean = false;
  @Input() canParticipate: boolean = false;
  @Input() showResults: boolean = false;
  @Input() token: string;

  @Output() changed = new EventEmitter<void>();

  bookedEvents: boolean[] = [];
  bestOption: number = 1;

  newParticipant: CreateParticipantDto = {
    name: '',
    selection: {},
    token: '',
  };
  editParticipant?: Participant;
  editDto?: UpdateParticipantDto;
  errors: string[] = [];

  constructor(
    protected pollService: PollService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.bookedEvents = this.pollEvents.map(e => this.poll.bookedEvents.includes(e._id));
    this.newParticipant.token = this.token;
    this.bestOption = Math.max(...this.pollEvents.map(event => event.participants) || 1); // TODO update when participants change
    this.clearSelection();
    this.validateNew();
  }

  submit() {
    this.pollService.participate(this.poll._id, this.newParticipant).subscribe(participant => {
      this.participants.unshift(participant);
      this.poll.participants++;
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

    this.pollService.editParticipant(this.poll._id, this.editParticipant._id, this.editDto).subscribe(participant => {
      this.cancelEdit();
      this.participants = this.participants.map(p => p._id === participant._id ? participant : p);
      this.onChange();
    });
  }

  deleteParticipation(participantId: string) {
    this.pollService.deleteParticipant(this.poll._id, participantId).subscribe(() => {
      this.participants = this.participants.filter(p => p._id !== participantId);
      this.poll.participants--;
      this.onChange();
    });
  }

  validateNew() {
    this.errors = checkParticipant(this.newParticipant, this.poll, this.participants);
  }

  validateEdit() {
    this.errors = checkParticipant(this.editDto!, this.poll, this.participants, this.editParticipant!._id);
  }

  clearSelection() {
    this.newParticipant.name = this.poll.settings.anonymous ? 'Anonymous' : '';
    this.pollService.selectAll(this.poll, this.pollEvents, this.newParticipant, 'no');
  }

  book() {
    const events = this.pollEvents.filter((e, i) => this.bookedEvents[i]).map(e => e._id);
    this.pollService.book(this.poll._id, events).subscribe(() => {
      this.toastService.success('Booking', 'Booked events successfully');
    });
  }

  private onChange() {
    this.changed.next();
  }
}

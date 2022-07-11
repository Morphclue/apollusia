import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {Poll} from '../../model/poll';
import {environment} from '../../../environments/environment';
import {Settings} from '../../model/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  private poll?: Poll;
  minDate = new Date();
  @Input() id: string | undefined;

  settingsForm = new FormGroup({
    maxParticipants: new FormControl(false),
    maxParticipantsInput: new FormControl('1'),
    allowMaybe: new FormControl(false),
    allowEdit: new FormControl(false),
    allowAnonymous: new FormControl(false),
    deadline: new FormControl(false),
    deadlineInput: new FormControl(''),
  });

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchPoll();
  }

  private fetchPoll() {
    this.http.get<Poll>(`${environment.backendURL}/poll/${this.id}`).subscribe((poll: Poll) => {
      this.poll = poll;
      if (poll.settings.deadline) {
        this.settingsForm.patchValue({
          deadline: true,
          deadlineInput: poll.settings.deadline,
        });
      }
    });
  }

  onFormSubmit() {
    let settings: Settings = {
      allowMaybe: this.settingsForm.value.allowMaybe,
      allowEdit: this.settingsForm.value.allowEdit,
      allowAnonymous: this.settingsForm.value.allowAnonymous,
    };

    if (this.settingsForm.value.maxParticipants) {
      settings.maxParticipants = parseInt(this.settingsForm.value.maxParticipantsInput);
    }
    if (this.settingsForm.value.deadline) {
      settings.deadline = this.settingsForm.value.deadlineInput;
    }
  }
}

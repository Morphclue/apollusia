import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  minDate = new Date();

  // FIXME: fetch from backend and initialize form
  settingsForm = new FormGroup({
    maxParticipants: new FormControl(false),
    maxParticipantsInput: new FormControl('1'),
    allowMaybe: new FormControl(false),
    allowEdit: new FormControl(false),
    allowAnonymous: new FormControl(false),
    deadline: new FormControl(false),
    deadlineInput: new FormControl('2022-07-13 00:00'),
  });

  constructor() {
  }

  ngOnInit(): void {
    this.settingsForm.valueChanges.subscribe(data => {
      console.log(data);
    });
  }

  onFormSubmit() {

  }
}

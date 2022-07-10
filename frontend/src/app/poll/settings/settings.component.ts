import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsForm = new FormGroup({
    maxParticipants: new FormControl(false),
    maxParticipantsInput: new FormControl('1'),
    allowMaybe: new FormControl(false),
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

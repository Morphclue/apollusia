import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss'],
})
export class CreatePollComponent implements OnInit {

  pollForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  })

  constructor() {
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    const value = this.pollForm.get('title')!.value;
    console.log(value);
  }
}

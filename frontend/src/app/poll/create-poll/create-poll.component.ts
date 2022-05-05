import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss'],
})
export class CreatePollComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  pollForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    deadline: new FormControl(null),
  });

  minDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.http.post(`${environment.backendURL}/poll`, {data: this.pollForm.value}).subscribe(() => {
      this.router.navigate(['dashboard']).then(
        // TODO: fallback logic
      );
    });
  }
}

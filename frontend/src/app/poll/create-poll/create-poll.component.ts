import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {CreatePollDto, Poll} from '../../model/poll';

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

  minDate = new Date();
  pollForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    deadline: new FormControl(null),
  });

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    const createPollDto: CreatePollDto = {
      title: this.pollForm.value.title,
      description: this.pollForm.value.description,
      settings: {
        deadline: this.pollForm.value.deadline,
        allowMaybe: false,
        allowEdit: false,
        allowAnonymous: false,
      },
    };

    this.http.post<Poll>(`${environment.backendURL}/poll`, createPollDto).subscribe((res: Poll) => {
      this.router.navigate([`poll/${res._id}/date`]).then(
        // TODO: fallback logic
      );
    });
  }
}

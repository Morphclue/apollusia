import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {CreatePollDto, Poll} from '../../model/poll';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-poll',
  templateUrl: './create-edit-poll.component.html',
  styleUrls: ['./create-edit-poll.component.scss'],
})
export class CreateEditPollComponent implements OnInit {

  isCollapsed: boolean = true;
  id: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
    });
  }

  minDate = new Date();
  pollForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    deadline: new FormControl(''),
    maxParticipants: new FormControl(false),
    maxParticipantsInput: new FormControl('1'),
    allowMaybe: new FormControl(false),
    allowEdit: new FormControl(false),
    allowAnonymous: new FormControl(false),
  });

  ngOnInit(): void {
    this.fetchPoll();
  }

  onFormSubmit(): void {
    const createPollDto: CreatePollDto = {
      title: this.pollForm.value.title,
      description: this.pollForm.value.description,
      settings: {
        deadline: this.pollForm.value.deadline,
        allowMaybe: this.pollForm.value.allowMaybe,
        allowEdit: this.pollForm.value.allowEdit,
        allowAnonymous: this.pollForm.value.allowAnonymous,
        maxParticipants: this.pollForm.value.maxParticipants ? parseInt(this.pollForm.value.maxParticipantsInput) : 1,
      },
    };

    this.http.post<Poll>(`${environment.backendURL}/poll`, createPollDto).subscribe((res: Poll) => {
      this.router.navigate([`poll/${res._id}/date`]).then(
        // TODO: fallback logic
      );
    });
  }

  private fetchPoll() {
    this.http.get<Poll>(`${environment.backendURL}/poll/${this.id}`).subscribe((poll: Poll) => {
      this.pollForm.patchValue({
        title: poll.title,
        description: poll.description,
        deadline: poll.settings.deadline,
        maxParticipants: poll.settings.maxParticipants !== undefined,
        maxParticipantsInput: poll.settings.maxParticipants ? poll.settings.maxParticipants.toString() : '1',
        allowMaybe: poll.settings.allowMaybe,
        allowEdit: poll.settings.allowEdit,
        allowAnonymous: poll.settings.allowAnonymous,
      });
    });
  }
}

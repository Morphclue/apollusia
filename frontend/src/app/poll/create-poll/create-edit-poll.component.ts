import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {TokenService} from '../../dashboard/token/token.service';
import {CreatePollDto, Poll} from '../../model/poll';

@Component({
  selector: 'app-create-edit-poll',
  templateUrl: './create-edit-poll.component.html',
  styleUrls: ['./create-edit-poll.component.scss'],
})
export class CreateEditPollComponent implements OnInit {
  isCollapsed: boolean = true;
  id: string = '';
  minDate = new Date();
  pollForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    deadline: new FormControl(),
    maxParticipants: new FormControl(true),
    maxParticipantsInput: new FormControl('1'),
    allowMaybe: new FormControl(false),
    allowEdit: new FormControl(false),
    allowAnonymous: new FormControl(false),
  });

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    this.fetchPoll();
  }

  onFormSubmit(): void {
    const poll = this.pollForm.value;
    const createPollDto: CreatePollDto = {
      title: poll.title!,
      description: poll.description ? poll.description : '',
      adminToken: this.tokenService.getToken(),
      settings: {
        deadline: poll.deadline ? new Date(poll.deadline) : undefined,
        allowMaybe: !!poll.allowMaybe,
        allowEdit: !!poll.allowEdit,
        allowAnonymous: !!poll.allowAnonymous,
        maxParticipants: poll.maxParticipants ? parseInt(<string>poll.maxParticipantsInput) : 1,
      },
    };

    if (!this.id) {
      this.http.post<Poll>(`${environment.backendURL}/poll`, createPollDto).subscribe((res: Poll) => {
        this.router.navigate([`poll/${res._id}/date`]).then(
          // TODO: fallback logic
        );
      });
      return;
    }

    this.http.put<Poll>(`${environment.backendURL}/poll/${this.id}`, createPollDto).subscribe(() => {
      this.router.navigate(['dashboard']).then(
        // TODO: fallback logic
      );
    });
  }

  private fetchPoll() {
    if (!this.id) {
      return;
    }

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

  open(content: any) {
    this.modalService.open(content).result.then(() => {
      this.http.delete(`${environment.backendURL}/poll/${this.id}`).subscribe(() => {
        this.router.navigate([`dashboard`]);
      });
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {MailService, TokenService} from '../../core/services';
import {CreatePollDto, Poll} from '../../model';
import {format} from 'date-fns';

@Component({
  selector: 'app-create-edit-poll',
  templateUrl: './create-edit-poll.component.html',
  styleUrls: ['./create-edit-poll.component.scss'],
})
export class CreateEditPollComponent implements OnInit {
  isCollapsed: boolean = true;
  id: string = '';
  poll?: Poll;
  minDate = new Date();
  mail?: string;
  isAdmin: boolean = false;
  pollForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    location: new FormControl(''),
    deadlineDate: new FormControl(),
    deadlineTime: new FormControl(),
    emailUpdates: new FormControl(false),
    maxParticipants: new FormControl(false),
    maxParticipantsInput: new FormControl(''),
    maxEventParticipants: new FormControl(false),
    maxEventParticipantsInput: new FormControl(''),
    allowMaybe: new FormControl(false),
    allowEdit: new FormControl(false),
    anonymous: new FormControl(false),
    blindParticipation: new FormControl(false),
  });

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    this.mail = this.mailService.getMail();
    this.fetchPoll();
    this.checkAdmin();
  }

  onFormSubmit(): void {
    const pollForm = this.pollForm.value;
    const deadline = pollForm.deadlineDate ? new Date(pollForm.deadlineDate + ' ' + (pollForm.deadlineTime || '00:00')) : undefined;
    const createPollDto: CreatePollDto & { adminToken: string } = {
      title: pollForm.title!,
      description: pollForm.description ? pollForm.description : '',
      location: pollForm.location ? pollForm.location : '',
      adminToken: this.tokenService.getToken(),
      adminMail: pollForm.emailUpdates ? this.poll?.adminMail || this.mail : undefined,
      settings: {
        deadline: deadline,
        allowMaybe: !!pollForm.allowMaybe,
        allowEdit: !!pollForm.allowEdit,
        anonymous: !!pollForm.anonymous,
        maxParticipants: pollForm.maxParticipants ? parseInt(<string>pollForm.maxParticipantsInput) : undefined,
        maxEventParticipants: pollForm.maxEventParticipants ? parseInt(<string>pollForm.maxEventParticipantsInput) : undefined,
        blindParticipation: !!pollForm.blindParticipation,
      },
    };

    if (!this.id) {
      this.postPoll(createPollDto);
      return;
    }

    this.updatePoll(createPollDto);
  }

  onCancel() {
    this.router.navigate(['dashboard']).then();
  }

  private updatePoll(poll: CreatePollDto) {
    this.http.put<Poll>(`${environment.backendURL}/poll/${this.id}`, poll).subscribe(() => {
      this.router.navigate(['dashboard']).then();
    });
  }

  private postPoll(poll: CreatePollDto) {
    this.http.post<Poll>(`${environment.backendURL}/poll`, poll).subscribe((res: Poll) => {
      this.router.navigate([`poll/${res._id}/date`]).then();
    });
  }

  private fetchPoll() {
    if (!this.id) {
      return;
    }

    this.http.get<Poll>(`${environment.backendURL}/poll/${this.id}`).subscribe((poll: Poll) => {
      this.poll = poll;
      this.pollForm.patchValue({
        title: poll.title,
        description: poll.description,
        location: poll.location,
        deadlineDate: poll.settings.deadline ? format(new Date(poll.settings.deadline), 'yyyy-MM-dd') : '',
        deadlineTime: poll.settings.deadline ? format(new Date(poll.settings.deadline), 'HH:mm') : '',
        emailUpdates: !!poll.adminMail,
        maxParticipants: poll.settings.maxParticipants !== undefined,
        maxParticipantsInput: poll.settings.maxParticipants ? poll.settings.maxParticipants.toString() : '',
        maxEventParticipants: poll.settings.maxEventParticipants !== undefined,
        maxEventParticipantsInput: poll.settings.maxEventParticipants ? poll.settings.maxEventParticipants.toString() : '',
        allowMaybe: poll.settings.allowMaybe,
        allowEdit: poll.settings.allowEdit,
        anonymous: poll.settings.anonymous,
        blindParticipation: poll.settings.blindParticipation,
      });
    });
  }

  open(content: any) {
    this.modalService.open(content).result.then(() => {
      this.http.delete(`${environment.backendURL}/poll/${this.id}`).subscribe(() => {
        this.router.navigate([`dashboard`]).then();
      });
    }).catch(() => {
    });
  }

  clonePoll() {
    this.http.post(`${environment.backendURL}/poll/${this.id}/clone`, {}).subscribe(() => {
      this.router.navigate(['dashboard']).then();
    });
  }

  private checkAdmin() {
    if (!this.id) {
      return;
    }

    const adminToken = this.tokenService.getToken();
    this.http.get<boolean>(`${environment.backendURL}/poll/${this.id}/admin/${adminToken}`).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}

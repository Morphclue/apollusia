import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SwPush} from '@angular/service-worker';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {format} from 'date-fns';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {MailService, TokenService} from '../../core/services';
import {CreatePollDto, Poll} from '../../model';

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
    pushUpdates: new FormControl(false),
    maxParticipants: new FormControl(false),
    maxParticipantsInput: new FormControl(0),
    maxParticipantEvents: new FormControl(false),
    maxParticipantEventsInput: new FormControl(0),
    maxEventParticipants: new FormControl(false),
    maxEventParticipantsInput: new FormControl(0),
    allowMaybe: new FormControl(false),
    allowEdit: new FormControl(false),
    anonymous: new FormControl(false),
    blindParticipation: new FormControl(false),
  });

  presets = [
    {
      title: 'Group',
      description: 'Pick the best time for a group of people to do something together.',
      settings: {
        maxParticipantEvents: false,
        maxEventParticipants: false,
        allowMaybe: true,
        allowEdit: true,
        blindParticipation: false,
      },
    },
    {
      title: '1:1 Availability',
      description: 'Let participants tell you their availability for a 1:1 meeting with you.',
      settings: {
        maxParticipantEvents: false,
        maxEventParticipants: false,
        allowMaybe: true,
        allowEdit: false,
        blindParticipation: true, // TODO participants should not see other participants' votes
      },
    },
    {
      title: '1:1 Slots',
      description: 'Let participants pick a single slot for a 1:1 meeting with you.',
      settings: {
        maxParticipantEvents: true,
        maxParticipantEventsInput: 1,
        maxEventParticipants: true,
        maxEventParticipantsInput: 1,
        allowMaybe: false,
        allowEdit: false,
        blindParticipation: true, // TODO participants should not see other participants' votes
      },
    },
  ];
  selectedPreset?: any;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private mailService: MailService,
    private swPush: SwPush,
  ) {
    const routeId: Observable<string> = route.params.pipe(map(({id}) => id));
    routeId.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    this.mail = this.mailService.getMail();
    this.fetchPoll();
    this.checkAdmin();

    this.pollForm.valueChanges.subscribe(value => {
      this.selectedPreset = this.presets.find(preset => {
        for (const [k, v] of Object.entries(preset.settings)) {
          if ((value as any)[k] !== v) {
            return false;
          }
        }
        return true;
      });
    });
  }

  async onFormSubmit() {
    const pollForm = this.pollForm.value;
    const deadline = pollForm.deadlineDate ? new Date(pollForm.deadlineDate + ' ' + (pollForm.deadlineTime || '00:00')) : undefined;
    const pushToken = pollForm.pushUpdates ? await this.swPush.requestSubscription({
      serverPublicKey: environment.vapidPublicKey,
    }) : undefined;
    const createPollDto: CreatePollDto & { adminToken: string } = {
      title: pollForm.title!,
      description: pollForm.description ? pollForm.description : '',
      location: pollForm.location ? pollForm.location : '',
      adminToken: this.tokenService.getToken(),
      adminMail: pollForm.emailUpdates ? this.poll?.adminMail || this.mail : undefined,
      adminPush: pollForm.pushUpdates && (this.poll?.adminPush || pushToken?.toJSON()) || undefined,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      bookedEvents: [],
      settings: {
        deadline: deadline?.toString(),
        allowMaybe: !!pollForm.allowMaybe,
        allowEdit: !!pollForm.allowEdit,
        anonymous: !!pollForm.anonymous,
        maxParticipants: pollForm.maxParticipants && pollForm.maxParticipantsInput || undefined,
        maxParticipantEvents: pollForm.maxParticipantEvents && pollForm.maxParticipantEventsInput || undefined,
        maxEventParticipants: pollForm.maxEventParticipants && pollForm.maxEventParticipantsInput || undefined,
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

  applyPreset(preset: any): void {
    this.selectedPreset = preset;
    this.pollForm.patchValue(preset.settings);
    this.pollForm.markAsDirty();
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
        pushUpdates: !!poll.adminPush,
        maxParticipants: !!poll.settings.maxParticipants,
        maxParticipantsInput: poll.settings.maxParticipants,
        maxParticipantEvents: !!poll.settings.maxParticipantEvents,
        maxParticipantEventsInput: poll.settings.maxParticipantEvents,
        maxEventParticipants: !!poll.settings.maxEventParticipants,
        maxEventParticipantsInput: poll.settings.maxEventParticipants,
        allowMaybe: poll.settings.allowMaybe,
        allowEdit: poll.settings.allowEdit,
        anonymous: poll.settings.anonymous,
        blindParticipation: poll.settings.blindParticipation,
      });
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

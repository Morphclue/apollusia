import {HttpClient} from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ShowResultOptions} from '@apollusia/types/lib/schema/show-result-options';
import {NgbModal, NgbTooltip, NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import {format} from 'date-fns';
import Keycloak, {type KeycloakProfile} from 'keycloak-js';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {LocationIconPipe} from '../../core/pipes/location-icon.pipe';
import {TokenService} from '../../core/services';
import {CreatePollDto, Poll} from '../../model';

@Component({
  selector: 'app-create-edit-poll',
  templateUrl: './create-edit-poll.component.html',
  styleUrls: ['./create-edit-poll.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgbTooltip,
    NgbCollapse,
    LocationIconPipe,
  ],
})
export class CreateEditPollComponent implements OnInit {
  readonly ShowResultOptions = ShowResultOptions;
  private modalService = inject(NgbModal);
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private keycloak = inject(Keycloak);
  route = inject(ActivatedRoute);
  isCollapsed: boolean = true;
  id: string = '';
  poll?: Poll;
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
    allowComments: new FormControl(true),
    logHistory: new FormControl(true),
    anonymous: new FormControl(false),
    showResultGroup: new FormGroup({
      showResult: new FormControl(ShowResultOptions.IMMEDIATELY),
    }),
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
        showResult: ShowResultOptions.IMMEDIATELY,
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
        showResult: ShowResultOptions.NEVER,
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
        showResult: ShowResultOptions.NEVER,
      },
    },
  ];
  selectedPreset?: any;

  userProfile?: KeycloakProfile;

  constructor(
  ) {
    const routeId: Observable<string> = this.route.params.pipe(map(({id}) => id));
    routeId.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
    if (this.keycloak.authenticated) {
      this.keycloak.loadUserProfile().then(user => {
        this.userProfile = user;
        this.pollForm.patchValue({
          emailUpdates: (user.attributes?.['notifications'] as string[])?.includes('admin:participant.new:email'),
          pushUpdates: (user.attributes?.['notifications'] as string[])?.includes('admin:participant.new:push'),
        });
      });
    } else {
      this.pollForm.controls.emailUpdates.disable();
      this.pollForm.controls.pushUpdates.disable();
    }

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
    const createPollDto: CreatePollDto & {adminToken: string} = {
      title: pollForm.title!,
      description: pollForm.description ? pollForm.description : '',
      location: pollForm.location ? pollForm.location : '',
      adminToken: this.tokenService.getToken(),
      adminMail: !!pollForm.emailUpdates,
      adminPush: !!pollForm.pushUpdates,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      bookedEvents: {},
      settings: {
        deadline: deadline?.toISOString(),
        allowMaybe: !!pollForm.allowMaybe,
        allowEdit: !!pollForm.allowEdit,
        anonymous: !!pollForm.anonymous,
        maxParticipants: pollForm.maxParticipants && pollForm.maxParticipantsInput || undefined,
        maxParticipantEvents: pollForm.maxParticipantEvents && pollForm.maxParticipantEventsInput || undefined,
        maxEventParticipants: pollForm.maxEventParticipants && pollForm.maxEventParticipantsInput || undefined,
        allowComments: !!pollForm.allowComments,
        logHistory: !!pollForm.logHistory,
        showResult: pollForm.showResultGroup?.showResult ?? ShowResultOptions.IMMEDIATELY,
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
        this.router.navigate(['dashboard']).then();
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
    this.pollForm.patchValue(preset.settings);
    this.pollForm.get('showResultGroup.showResult')?.setValue(preset.settings.showResult);
    this.selectedPreset = preset;
    this.pollForm.markAsDirty();
  }

  private updatePoll(poll: CreatePollDto) {
    this.http.put<Poll>(`${environment.backendURL}/poll/${this.id}`, poll).subscribe(() => {
      this.router.navigate(['dashboard']).then();
    });
  }

  private postPoll(poll: CreatePollDto) {
    this.http.post<Poll>(`${environment.backendURL}/poll`, poll).subscribe((res: Poll) => {
      this.router.navigate([`poll/${res.id}/date`]).then();
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
        allowComments: poll.settings.allowComments,
        logHistory: poll.settings.logHistory,
        showResultGroup: {
          showResult: poll.settings.showResult,
        },
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

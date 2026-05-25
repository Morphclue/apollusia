import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ShowResultOptions} from '@apollusia/types/lib/schema/show-result-options';
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbTooltip,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import {format} from 'date-fns';
import Keycloak, {type KeycloakProfile} from 'keycloak-js';
import {EMPTY, Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, share, switchMap} from 'rxjs/operators';
import {LocationIconPipe} from '../../core/pipes/location-icon.pipe';
import {TokenService} from '../../core/services';
import {CreatePoll, EditPoll, ReadPoll} from '../../model';
import {KeycloakService} from '../services/keycloak.service';
import {PollService} from '../services/poll.service';

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
    NgbTypeahead,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
  ],
})
export class CreateEditPollComponent implements OnInit {
  readonly ShowResultOptions = ShowResultOptions;
  private modalService = inject(NgbModal);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private keycloak = inject(Keycloak);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(KeycloakService);
  private readonly pollService = inject(PollService);

  isCollapsed: boolean = true;
  poll?: {id?: string} & (EditPoll | ReadPoll);

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
  ] as const;
  selectedPreset?: (typeof this.presets)[number];

  userProfile?: KeycloakProfile;
  adminProfiles: KeycloakProfile[] = [];

  search: OperatorFunction<string, KeycloakProfile[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(id => id.length === 36), // length of a UUID
    switchMap(id => this.userService.getUser(id)),
    map(user => [user]),
  );

  formatter = (user: KeycloakProfile) => `${user.firstName} ${user.lastName} (${user.email})`;

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
    const createPollDto: CreatePoll & {adminToken: string} = {
      title: pollForm.title!,
      description: pollForm.description ? pollForm.description : '',
      location: pollForm.location ? pollForm.location : '',
      adminToken: this.tokenService.getToken(),
      adminMail: !!pollForm.emailUpdates,
      adminPush: !!pollForm.pushUpdates,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      adminRoles: Object.fromEntries(this.adminProfiles.map(u => [u.id!, 'edit'])),
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

    if (this.route.snapshot.params['id']) {
      this.updatePoll(createPollDto);
    } else {
      this.postPoll(createPollDto);
    }
  }

  onCancel() {
    this.router.navigate(['dashboard']).then();
  }

  open(content: TemplateRef<unknown>) {
    this.modalService.open(content).result.then(() => {
      this.pollService.delete(this.route.snapshot.params['id']).subscribe(() => {
        this.router.navigate(['dashboard']).then();
      });
    }).catch(() => {
    });
  }

  clonePoll() {
    this.pollService.clone(this.route.snapshot.params['id']).subscribe(() => {
      this.router.navigate(['dashboard']).then();
    });
  }

  applyPreset(preset: any): void {
    this.pollForm.patchValue(preset.settings);
    this.pollForm.get('showResultGroup.showResult')?.setValue(preset.settings.showResult);
    this.selectedPreset = preset;
    this.pollForm.markAsDirty();
  }

  private updatePoll(poll: EditPoll) {
    this.pollService.update(this.route.snapshot.params['id'], poll).subscribe(() => {
      this.router.navigate(['dashboard']).then();
    });
  }

  private postPoll(poll: CreatePoll) {
    this.pollService.create(poll).subscribe(res => {
      this.router.navigate([`poll/${res.id}/date`]).then();
    });
  }

  private fetchPoll() {
    const poll$ = this.route.params.pipe(
      filter(({id}) => !!id),
      switchMap(({id}) => this.pollService.get(id)),
      share(),
    );

    poll$.pipe(
      switchMap(({adminRoles}) => adminRoles ? this.userService.getUsersByIds(Object.keys(adminRoles)) : EMPTY),
    ).subscribe(users => {
      this.adminProfiles = users;
    });

    poll$.subscribe(poll => {
      this.poll = {...poll, adminToken: ''};
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

  addAdmin(user: KeycloakProfile) {
    if (this.userProfile?.id === user.id) {
      // can't add yourself again
      return;
    }
    if (!this.adminProfiles.some(e => e.id === user.id)) {
      // prevent duplicates
      this.adminProfiles.push(user);
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {TokenService} from '../../core/token/token.service';
import {CreatePollDto, Poll} from '../../model';

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
    maxParticipants: new FormControl(false),
    maxParticipantsInput: new FormControl('', [Validators.required, Validators.min(1)]),
    allowMaybe: new FormControl(false),
    allowEdit: new FormControl(false),
    allowAnonymous: new FormControl(false),
    blindParticipation: new FormControl(false),
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
    const pollForm = this.pollForm.value;
    const createPollDto: CreatePollDto = {
      title: pollForm.title!,
      description: pollForm.description ? pollForm.description : '',
      adminToken: this.tokenService.getToken(),
      settings: {
        deadline: pollForm.deadline ? new Date(pollForm.deadline) : undefined,
        allowMaybe: !!pollForm.allowMaybe,
        allowEdit: !!pollForm.allowEdit,
        allowAnonymous: !!pollForm.allowAnonymous,
        maxParticipants: pollForm.maxParticipants ? parseInt(<string>pollForm.maxParticipantsInput) : undefined,
        blindParticipation: !!pollForm.blindParticipation,
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
        maxParticipantsInput: poll.settings.maxParticipants ? poll.settings.maxParticipants.toString() : '',
        allowMaybe: poll.settings.allowMaybe,
        allowEdit: poll.settings.allowEdit,
        allowAnonymous: poll.settings.allowAnonymous,
        blindParticipation: poll.settings.blindParticipation,
      });
    });
  }

  open(content: any) {
    this.modalService.open(content).result.then(() => {
      this.http.delete(`${environment.backendURL}/poll/${this.id}`).subscribe(() => {
        this.router.navigate([`dashboard`]);
      });
    }).catch(() => {
    });
  }
}

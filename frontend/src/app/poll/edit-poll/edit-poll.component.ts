import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-edit-poll',
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.scss'],
})
export class EditPollComponent implements OnInit {

  id: string = '';

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const id: Observable<string> = route.params.pipe(map(p => p.id));
    id.subscribe((id: string) => {
      this.id = id;
    });
  }

  ngOnInit(): void {
  }

  open(content: any) {
    this.modalService.open(content).result.then(() => {
      this.http.delete(`${environment.backendURL}/poll/${this.id}`).subscribe(() => {
        this.router.navigate([`dashboard`]);
      });
    }, (reason) => {
      // TODO: Logic if poll not deleted
    });
  }

}

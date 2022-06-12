import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-poll',
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.scss'],
})
export class EditPollComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
  }

  open(content: any) {
    this.modalService.open(content).result.then((result) => {
      // TODO: delete poll
    }, (reason) => {
      // TODO: Logic if poll not deleted
    })
  }

}

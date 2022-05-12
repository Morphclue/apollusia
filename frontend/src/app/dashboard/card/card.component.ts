import {Component, Input, OnInit} from '@angular/core';
import {PollDto} from '../../dto/poll.dto';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() pollDto: PollDto | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

}

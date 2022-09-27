import {Component, Input, OnInit} from '@angular/core';

import {Poll} from '../../model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() poll: Poll | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }
}

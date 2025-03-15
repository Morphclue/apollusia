import {Component, OnInit} from '@angular/core';

import {ChooseDateService} from '../../poll/services/choose-date.service';

@Component({
  selector: 'app-postpone-modal',
  templateUrl: './postpone-modal.component.html',
  styleUrls: ['./postpone-modal.component.scss'],
  standalone: false,
})
export class PostponeModalComponent implements OnInit {
  postponeDays: number = 0;

  constructor(
    private chooseDateService: ChooseDateService,
  ) {
  }

  ngOnInit(): void {
  }

  apply() {
    this.chooseDateService.postpone(this.postponeDays);
  }
}

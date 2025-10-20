import { Component, OnInit } from '@angular/core';

import { FeaturesComponent } from '../features/features.component';
import { InformationComponent } from '../information/information.component';
import { PromisesComponent } from '../promises/promises.component';
import { StatisticsComponent } from '../statistics/statistics.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    InformationComponent,
    PromisesComponent,
    StatisticsComponent,
    FeaturesComponent,
  ],
})
export class AboutComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}

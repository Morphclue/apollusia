import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./promises.component.scss'],
})
export class PromisesComponent {
  promises = [
    {
      icon: 'bi-box2-heart',
      title: $localize`:@@about-promise-free-title:100% Free`,
      description: $localize`:@@about-promise-free-description:Apollusia is completely free to use, providing you with all the event polling features you need without any charges.`
    },
    {
      icon: 'bi-gear',
      title: $localize`:@@about-promise-service-title:Service`,
      description: $localize`:@@about-promise-service-description:We offer a comprehensive set of tools and options, making it the ultimate choice for your event polling needs.`
    },
    {
      icon: 'bi-code-slash',
      title: $localize`:@@about-promise-open-source-title:Open-Source`,
      description: $localize`:@@about-promise-open-source-description:This product is open-source, which means you have access to its source code, allowing you to customize and contribute to the platform.`
    }
  ];
}

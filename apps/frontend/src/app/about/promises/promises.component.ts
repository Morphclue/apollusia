import {Component} from '@angular/core';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styleUrls: ['./promises.component.scss'],
  standalone: false,
})
export class PromisesComponent {
  promises = [
    {
      icon: 'bi-box2-heart',
      title: '100% Free',
      description: 'Apollusia is completely free to use, providing you with all the event polling features you need without any charges.'
    },
    {
      icon: 'bi-gear',
      title: 'Service',
      description: 'We offer a comprehensive set of tools and options, making it the ultimate choice for your event polling needs.'
    },
    {
      icon: 'bi-code-slash',
      title: 'Open-Source',
      description: 'This product is open-source, which means you have access to its source code, allowing you to customize and contribute to the platform.'
    }
  ];
}

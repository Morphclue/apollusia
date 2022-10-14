import {Component, Input, OnInit} from '@angular/core';

import {Poll} from '../../model';
import {TokenService} from '../../core/services';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() poll: Poll | undefined;

  constructor(private tokenService: TokenService) {
  }

  ngOnInit(): void {
  }

  isAdmin() {
    return this.poll?.adminToken === this.tokenService.getToken();
  }
}

import { Component, inject, OnInit } from '@angular/core';
import {ImprintDto} from '@apollusia/types';

import {ImprintService} from '../services/imprint.service';

@Component({
  selector: 'apollusia-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
  standalone: false,
})
export class LegalComponent implements OnInit{
  private imprintService  =inject(ImprintService);
  imprint?: ImprintDto;

  ngOnInit() {
    this.imprintService.getImprint().subscribe((imprint: ImprintDto) => this.imprint = imprint);
  }
}

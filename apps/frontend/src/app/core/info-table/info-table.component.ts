import {Component, Input, OnInit} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';

import {ReadPoll} from '../../model';

@Component({
  selector: 'apollusia-info-table',
  templateUrl: './info-table.component.html',
  styleUrl: './info-table.component.scss',
})
export class InfoTableComponent implements OnInit {
  @Input({required: true}) poll: ReadPoll;
  @Input() description = true;
  @Input() stats = false;

  url = '';

  constructor(
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.url = `${document.baseURI}poll/${this.poll.id}/participate`;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.url).then(() => {
      this.toastService.success('Copy Poll Link', 'Successfully copied link to clipboard');
    }).catch(e => {
      this.toastService.error('Copy Poll Link', 'Failed to copy link to clipboard', e);
    });
  }
}

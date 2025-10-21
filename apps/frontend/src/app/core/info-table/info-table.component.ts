import {DatePipe} from '@angular/common';
import {Component, inject, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {ReadPoll} from '../../model';
import {BASE_URL} from '../injection-tokens/base-url';
import {LocationLinkComponent} from '../location-link/location-link.component';
import {MarkdownComponent} from '../markdown/markdown.component';
import {LocationIconPipe} from '../pipes/location-icon.pipe';

@Component({
  selector: 'apollusia-info-table',
  templateUrl: './info-table.component.html',
  styleUrl: './info-table.component.scss',
  imports: [
    NgbTooltip,
    LocationLinkComponent,
    MarkdownComponent,
    RouterLink,
    DatePipe,
    LocationIconPipe,
  ],
})
export class InfoTableComponent implements OnInit {
  @Input({required: true}) poll: ReadPoll;
  @Input() description = true;
  @Input() stats = false;
  private toastService = inject(ToastService);
  private baseUrl? = inject(BASE_URL, { optional: true });

  url = '';

  ngOnInit() {
    this.url = `${this.baseUrl}/poll/${this.poll.id}/participate`;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.url).then(() => {
      this.toastService.success('Copy Poll Link', 'Successfully copied link to clipboard');
    }).catch(e => {
      this.toastService.error('Copy Poll Link', 'Failed to copy link to clipboard', e);
    });
  }

  draftEmail() {
    const subject = `Poll Invitation: ${this.poll!.title}`;
    const body = `Hello,

I would like to invite you to participate in a poll.
Please click the link below to participate.

${this.url}

Thank you!`;

    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    open(mailto, '_self');
  }
}

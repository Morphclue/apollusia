import {Component, inject, Input, OnInit, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {MarkdownService} from '../services/markdown.service';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  standalone: false,
})
export class MarkdownComponent implements OnInit {
  @Input() text!: string;
  private sanitizer = inject(DomSanitizer);
  private markdownService = inject(MarkdownService);
  html!: SafeHtml;

  ngOnInit(): void {
    const rendered = this.markdownService.render(this.text);
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.sanitizer.sanitize(SecurityContext.HTML, rendered) || '');
  }
}

import {Component, ElementRef, Input, OnInit, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {MarkdownService} from '../services/markdown.service';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
})
export class MarkdownComponent implements OnInit {
  @Input() text!: string;

  html!: SafeHtml;

  constructor(
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private markdownService: MarkdownService,
  ) {
  }

  ngOnInit(): void {
    const rendered = this.markdownService.render(this.text);
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.sanitizer.sanitize(SecurityContext.HTML, rendered) || '');
  }
}

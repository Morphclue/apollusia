import {Component, ElementRef, Input, OnInit, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import * as MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

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
  ) {
  }

  ngOnInit(): void {
    const rendered = markdown.render(this.text);
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.sanitizer.sanitize(SecurityContext.HTML, rendered) || '');
  }
}

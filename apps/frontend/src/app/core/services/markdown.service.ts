import {Injectable} from '@angular/core';
import MarkdownIt from 'markdown-it';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  readonly markdown = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true,
  });

  render(text: string): string {
    return this.markdown.render(text);
  }
}

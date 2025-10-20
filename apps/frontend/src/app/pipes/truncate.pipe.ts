import {Pipe, PipeTransform} from '@angular/core';

// reference: https://stackoverflow.com/questions/44669340/how-to-truncate-text-in-angular2

@Pipe({ name: 'truncate', })
export class TruncatePipe implements PipeTransform {
  transform(value: string | undefined, args: any[]): string {
    if (!value) {
      return '';
    }
    const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
    const trail = args.length > 1 ? args[1] : '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}

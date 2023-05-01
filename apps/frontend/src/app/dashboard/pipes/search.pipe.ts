import {Pipe, PipeTransform} from '@angular/core';

import {ReadPoll} from '../../model';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: ReadPoll[], search: string): ReadPoll[] {
    search = search.toLowerCase();
    return value.filter(poll => poll.title.toLowerCase().includes(search) || poll.description?.toLowerCase().includes(search));
  }
}

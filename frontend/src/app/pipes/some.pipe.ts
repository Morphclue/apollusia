import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'some',
})
export class SomePipe implements PipeTransform {
  transform(participations: string[], pollEventId: string | undefined): boolean {
    return pollEventId ? participations.includes(pollEventId) : false;
  }
}

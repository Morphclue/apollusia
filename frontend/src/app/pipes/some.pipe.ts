import {Pipe, PipeTransform} from '@angular/core';
import {PollEvent} from '../model/poll-event';

@Pipe({
  name: 'some',
})
export class SomePipe implements PipeTransform {
  transform(participations: PollEvent[], pollEventId: string | undefined): boolean {
    return participations.some(participation => participation._id === pollEventId);
  }
}

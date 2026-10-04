import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {map} from 'rxjs/operators';
import {PollService} from '../services/poll.service';

export const PollAdminGuard: CanActivateFn  = (route) => {
  const id = route.params['id'];
  if (!id) {
    return true;
  }

  const pollService = inject(PollService);
  return pollService.get(id).pipe(
    map(poll => !!poll.adminRole),
  );
}

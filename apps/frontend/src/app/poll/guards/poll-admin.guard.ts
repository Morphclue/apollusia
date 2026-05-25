import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {TokenService} from '../../core/services';
import {PollService} from '../services/poll.service';

export const PollAdminGuard: CanActivateFn  = (route) => {
  const id = route.params['id'];
  if (!id) {
    return true;
  }

  const tokenService = inject(TokenService);
  const pollService = inject(PollService);

  const adminToken = tokenService.getToken();
  return pollService.isAdmin(id, adminToken);
}

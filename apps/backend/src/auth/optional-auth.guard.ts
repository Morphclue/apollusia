import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err) {
      throw err; // the default implementation checks if user is falsy and throws an UnauthorizedException
    }
    return user;
  }
}

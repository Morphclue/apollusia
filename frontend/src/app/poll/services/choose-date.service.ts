import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChooseDateService {

  constructor() {
  }

  floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
  }

  ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / precision) * precision;
  }
}

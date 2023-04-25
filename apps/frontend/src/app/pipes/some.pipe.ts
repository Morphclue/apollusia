import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'some',
})
export class SomePipe implements PipeTransform {
  transform<T>(array: T[], search: T): boolean {
    return array.includes(search);
  }
}

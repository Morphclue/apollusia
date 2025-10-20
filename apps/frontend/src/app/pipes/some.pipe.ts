import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'some', })
export class SomePipe implements PipeTransform {
  transform<T>(array: T[] | unknown, search: T): boolean {
    return Array.isArray(array) && array.includes(search);
  }
}

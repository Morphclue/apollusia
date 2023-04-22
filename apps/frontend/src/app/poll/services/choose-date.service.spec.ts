import {TestBed} from '@angular/core/testing';

import {ChooseDateService} from './choose-date.service';

describe('ChooseDateService', () => {
  let service: ChooseDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChooseDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

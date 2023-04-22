import {TestBed} from '@angular/core/testing';

import {ParticipantTokenInterceptor} from './participant-token.interceptor';

describe('ParticipantTokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ParticipantTokenInterceptor,
    ],
  }));

  it('should be created', () => {
    const interceptor: ParticipantTokenInterceptor = TestBed.inject(ParticipantTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

import {SomePipe} from './some.pipe';

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new SomePipe();
    expect(pipe).toBeTruthy();
  });
});

import axios from 'axios';
import {describe, expect, it} from 'vitest';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get('/api');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({message: 'Hello API'});
  });
});

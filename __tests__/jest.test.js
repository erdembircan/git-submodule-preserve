import fs from 'fs';

jest.mock('fs');

describe('jest configs', () => {
  it('should work', () => {
    expect(true).toBeTruthy();
  });
});

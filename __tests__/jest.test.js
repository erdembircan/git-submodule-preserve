import fs from 'fs';

jest.mock('fs');

describe('jest configs', () => {
  it('should work', () => {
    expect(true).toBeTruthy();
  });
  it('should import mocked modules correctly', () => {
    expect(fs.__moduleMockTest).toBeTruthy();
  });
});

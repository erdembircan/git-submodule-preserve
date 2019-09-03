import fs from 'fs';
import path from 'path';

jest.mock('fs');

const mockPath1 = 'path/to/file.txt';
const mockPath2 = 'path/to/anotherfile.txt';
const mockPath3 = 'path/to/empty_directory';
const arrayPath = [mockPath1, mockPath2];

afterEach(() => {
  fs.__resetAllPaths();
});

describe('fs mock module', () => {
  it('should mock fs module', () => {
    expect(fs.__moduleMockTest).toBeTruthy();
  });
  it('should add source paths with paramater as array or string', () => {
    fs.__setSourcePaths(mockPath1);
    expect(fs.__getSourcePaths()).toEqual(expect.arrayContaining([mockPath1]));

    fs.__setSourcePaths(arrayPath);
    expect(fs.__getSourcePaths()).toEqual(expect.arrayContaining(arrayPath));
  });
  it('should clear source paths at every set operation', () => {
    fs.__setSourcePaths(mockPath1);
    fs.__setSourcePaths(mockPath2);

    expect(fs.__getSourcePaths().length).toBe(1);
    expect(fs.__getSourcePaths()).toEqual(expect.arrayContaining([mockPath2]));
  });
  it('should return immutable versions of sourcePaths & targetPaths', () => {
    fs.__setSourcePaths(mockPath1);
    const unmutablePaths = fs.__getSourcePaths();
    unmutablePaths.push(mockPath2);
    expect(fs.__getSourcePaths().length).toBe(1);
  });
  it('should mock mkDirSync with no parents in targetPaths', () => {
    fs.mkdirSync(mockPath3);
    expect(fs.__getTargetPaths()).toEqual(expect.arrayContaining([mockPath3]));
    expect(fs.__getTargetPaths().length).toBe(1);
  });
  it('should mock mkDirSync with a parent in targetPaths', () => {
    fs.mkdirSync(mockPath3);
    const childPath = path.join(mockPath3, 'file.txt');
    fs.mkdirSync(childPath);
    expect(fs.__getTargetPaths()).toEqual(expect.arrayContaining([childPath]));
    expect(fs.__getTargetPaths().length).toBe(1);
  });
});

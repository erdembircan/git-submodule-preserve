import fs from 'fs';
import path from 'path';

jest.mock('fs');

const mockPath1 = 'path/to/file.txt';
const mockPath2 = 'path/to/anotherfile.txt';
const mockPath3 = 'path/to/empty_directory';
const mockPath4 = 'path/to/more/layered/super.txt';
const mockPath5 = 'path/not/to/more/layered/super.txt';
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
  it('mkDirSync: should create directory with no parents in targetPaths', () => {
    fs.mkdirSync(mockPath3);
    expect(fs.__getTargetPaths()).toEqual(expect.arrayContaining([mockPath3]));
    expect(fs.__getTargetPaths().length).toBe(1);
  });
  it('mkDirSync: should create directory with a parent in targetPaths', () => {
    fs.mkdirSync(mockPath3);
    const childPath = path.join(mockPath3, 'file.txt');
    fs.mkdirSync(childPath);
    expect(fs.__getTargetPaths()).toEqual(expect.arrayContaining([childPath]));
    expect(fs.__getTargetPaths().length).toBe(1);
  });
  it('__pathRegex: should dissect and find next dir/file value with a regex operation', () => {
    let nextDir = fs.__pathRegex('path/to', mockPath3);
    expect(nextDir).toBe('empty_directory');
    nextDir = fs.__pathRegex('path/to', mockPath4);
    expect(nextDir).toBe('more');
    nextDir = fs.__pathRegex('path/to', mockPath2);
    expect(nextDir).toBe('anotherfile.txt');
  });
  it('readdirSync: should read source paths correctly', () => {
    fs.__setSourcePaths([...arrayPath, mockPath3, mockPath5]);

    let dirStructure = fs.readdirSync('path/to');
    expect(dirStructure.length).toBe(3);

    fs.__resetAllPaths();
    fs.__setSourcePaths(arrayPath);

    dirStructure = fs.readdirSync('path');
    expect(dirStructure.length).toBe(1);

    dirStructure = fs.readdirSync('no/path');
    expect(dirStructure.length).toBe(0);
  });
  it('statSync: should identify path as a directory or a file', () => {
    expect(fs.statSync(mockPath1).isDirectory()).toBeFalsy();
    expect(fs.statSync(mockPath3).isDirectory()).toBeTruthy();
  });
});

import fs from 'fs';
import path from 'path';

// import { toolBox } from '../src/SubmodulePreserve';
import { copyDir } from '../src/toolbox';

jest.mock('fs');

afterEach(() => {
  fs.__resetAllPaths();
});

function pickOuterParent(fullPath) {
  return fullPath.match(/(?:[\w]+\/)(.+)/)[1];
}

describe('toolBox', () => {
  it('copyDir: should copy directory with one path tree', async done => {
    const srcPath = 'path/to/inner/layer/file.txt';
    const destPath = 'destPath';
    const srcMinParent = pickOuterParent(srcPath);
    const copiedDestPath = path.join(destPath, srcMinParent);
    fs.__setSourcePaths(srcPath);
    await copyDir('path', destPath);
    expect(fs.__getTargetPaths().length).toBe(1);
    expect(fs.__getTargetPaths()).toEqual(expect.arrayContaining([copiedDestPath]));
    done();
  });
  it('copyDir: should copy directory with multiple path trees', async done => {
    const srcPath = ['path/to/inner/layer/file.txt', 'path/to/other', 'path/whole/another/inner/layer/test.txt'];
    const destPath = 'destPath';
    const srcMinParent = pickOuterParent(srcPath[0]);

    fs.__setSourcePaths(srcPath);

    await copyDir('path', destPath);
    expect(fs.__getTargetPaths().length).toBe(3);
    expect(fs.__getTargetPaths()).toEqual(
      srcPath.map(p => {
        return path.join(destPath, pickOuterParent(p));
      })
    );
    done();
  });
});

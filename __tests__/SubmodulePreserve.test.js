import fs from 'fs';
import path from 'path';

import { toolBox } from '../src/SubmodulePreserve';

jest.mock('fs');

describe('toolBox', () => {
  it('should be exported only with NODE_ENV value of test', async done => {
    // no need to call the test script with a NODE_ENV value of test since jest assign this value automatically
    const { NODE_ENV: currentEnv } = process.env;
    expect(toolBox).toBeDefined();
    expect(currentEnv).toBe('test');

    jest.resetModules();

    const envOverride = 'development';
    process.env.NODE_ENV = envOverride;
    const { toolBox: otherDynamicToolbox } = await import('../src/SubmodulePreserve.js');
    expect(process.env.NODE_ENV).toBe(envOverride);
    expect(otherDynamicToolbox).toBeUndefined();

    jest.resetModules();
    done();
  });
  it('copyDir: should copy directory with one path tree', async done => {
    const srcPath = 'path/to/inner/layer/file.txt';
    const destPath = 'destPath';
    const srcMinParent = srcPath.match(/(?:[\w]+\/)(.+)/)[1];
    const copiedDestPath = path.join(destPath, srcMinParent);
    fs.__setSourcePaths(srcPath);
    await toolBox.copyDir('path', destPath);
    expect(fs.__getTargetPaths().length).toBe(1);
    expect(fs.__getTargetPaths()).toEqual(expect.arrayContaining([copiedDestPath]));
    done();
  });
});

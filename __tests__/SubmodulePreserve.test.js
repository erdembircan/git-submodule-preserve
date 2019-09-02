import fs from 'fs';
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
    const paths = 'source/layer1/layer2/file.txt';
    fs.__setSourcePaths(paths);
    const sourcePaths = fs.__getSourcePaths();
    const targetPaths = fs.__getTargetPaths();

    expect(Object.prototype.toString.call(sourcePaths)).toBe('[object Array]');
    expect(sourcePaths).toEqual(expect.arrayContaining([paths]));
    expect(Object.prototype.toString.call(targetPaths)).toBe('[object Array]');
    expect(targetPaths.length).toBe(0);

    fs.mkdirSync(paths);
    expect(fs.__getTargetPaths()).toEqual(expect.arrayContaining([paths]));
    done();
  });
});

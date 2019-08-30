import { toolBox } from '../src/SubmodulePreserve';

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
});

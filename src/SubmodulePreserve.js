import fs from 'fs';
import path from 'path';
import folderDelete from 'folder-delete';
import { copyDir, log } from './toolbox';

let continueOperation = true;

/**
 * nuxt generate:before hook call
 *
 * @async
 * @param {object} nuxt nuxt object
 */
async function generateBeforeHook(nuxt) {
  const genPath = nuxt.options.generate.dir;
  const { rootDir } = nuxt.options;
  const gitSourcePath = path.join(genPath, '.git');
  const gitDestPath = path.join(rootDir, '.subPreserve', '.git');
  if (fs.existsSync(gitSourcePath)) {
    try {
      folderDelete(path.join(rootDir, '.subPreserve'));
      await copyDir(gitSourcePath, gitDestPath);
      log('git initialization found');
    } catch (e) {
      log(`an error occured: ${e.message}`);
    }
  } else {
    log('no git initialization found on generate path', 'warning');
    continueOperation = false;
  }
}

/**
 * nuxt generate:done hook call
 *
 * @async
 * @param {object} nuxt nuxt object
 */
async function generateDone(nuxt) {
  if (continueOperation) {
    const genPath = nuxt.options.generate.dir;
    const { rootDir } = nuxt.options;
    const gitDestPath = path.join(genPath, '.git');
    const gitSourcePath = path.join(rootDir, '.subPreserve', '.git');
    try {
      await copyDir(gitSourcePath, gitDestPath);
      folderDelete(path.join(rootDir, '.subPreserve'));
      log(`operation completed, submodule preserved`, 'success');
    } catch (e) {
      log(`an error occured: ${e.message}`, 'error');
    }
  }
}

/**
 * entry point for nuxt module logic
 */
function SubmodulePreserve() {
  this.nuxt.hook('generate:before', generateBeforeHook);
  this.nuxt.hook('generate:done', generateDone);
}

// meta export for nuxt npm module
SubmodulePreserve.meta = require('../package.json');

/**
 * @module SubmodulePreserve
 */
export default SubmodulePreserve;

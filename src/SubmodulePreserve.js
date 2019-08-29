import fs from 'fs';
import path from 'path';
import { stdout } from 'process';
import ft from 'fancy-terminal';
import folderDelete from 'folder-delete';

let continueOperation = true;

/**
 * logger function
 * @param {string} message message to be outputted to stdout
 * @param {string} [type='info'] message type, possible types are info, warning, success and error
 */
function log(message, type = 'info') {
  const types = {
    info: ['blue', '💡'],
    warning: ['yellow', '⚠️'],
    success: ['green', '✔️'],
    error: ['red', '⛔'],
  };
  const cLog = ft[types[type][0]] || ft.black;
  stdout.write(`${ft.cyan('[SubmodulePreserve]')}: ${types[type][1] || ''}  ${cLog(message)}\n`);
}

/**
 * recursive directory copy
 *
 * @param {string} from source path
 * @param {string} to destination path
 *
 * @returns {Promise<object|void>} a Promise object
 */
function copyDir(from, to) {
  return new Promise((res, rej) => {
    try {
      fs.mkdirSync(to, { recursive: true });
      fs.readdirSync(from).forEach(dir => {
        const currSrcPath = path.join(from, dir);
        const currDestPath = path.join(to, dir);
        if (fs.statSync(currSrcPath).isDirectory()) {
          copyDir(currSrcPath, currDestPath);
        } else {
          fs.copyFileSync(currSrcPath, currDestPath);
        }
      });
      res();
    } catch (e) {
      rej(e);
    }
  });
}

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
 * @module SubmodulePreserve
 */
export default function SubmodulePreserve() {
  this.nuxt.hook('generate:before', generateBeforeHook);
  this.nuxt.hook('generate:done', generateDone);
}

module.exports.meta = '../package.json';

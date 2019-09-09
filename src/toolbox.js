import fs from 'fs';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import ft from 'fancy-terminal';
import { stdout } from 'process';

/**
 * logger function
 * @param {string} message message to be outputted to stdout
 * @param {string} [type='info'] message type, possible types are info, warning, success and error
 */
export function log(message, type = 'info') {
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
export function copyDir(from, to) {
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

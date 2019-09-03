/* eslint-disable no-underscore-dangle */
import path from 'path';

const fs = jest.genMockFromModule('fs');

let sourcePaths = [];
let targetPaths = [];

/**
 * set fake source paths for fs operations
 * @param {array - string} paths an array of fake paths for source directories and files
 */
function __setSourcePaths(paths) {
  if (Object.prototype.toString.call(paths) !== '[object Array]') {
    paths = [paths];
  }
  sourcePaths = paths;
  targetPaths = [];
}

function mkdirSync(to) {
  const parent = path.dirname(to);
  if (targetPaths.includes(parent)) {
    const index = targetPaths.indexOf(parent);
    targetPaths[index] = to;
  } else {
    targetPaths.push(to);
  }
}

fs.__setSourcePaths = __setSourcePaths;

fs.__getSourcePaths = () => [...sourcePaths];
fs.__getTargetPaths = () => [...targetPaths];

fs.mkdirSync = mkdirSync;
fs.__moduleMockTest = true;

fs.__resetAllPaths = () => {
  (targetPaths = []), (sourcePaths = []);
};

export default fs;

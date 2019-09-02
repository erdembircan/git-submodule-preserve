/* eslint-disable no-underscore-dangle */
import path from 'path';

const fs = jest.genMockFromModule('fs');

fs.__moduleMockTest = true;

let sourcePaths = [];
let targetPaths = [];

function __setSourcePaths(paths) {
  if (!paths.push) {
    paths = [paths];
  }
  sourcePaths = paths;
  targetPaths = [];
}

function mkdirSync(to) {
  const parent = path.dirname(to);
  if (targetPaths.includes(parent)) {
    targetPaths[targetPaths.indexOf(parent)] = to;
  } else {
    targetPaths.push(to);
  }
}

fs.__setSourcePaths = __setSourcePaths;
fs.__getSourcePaths = () => [...sourcePaths];
fs.__getTargetPaths = () => [...targetPaths];
fs.mkdirSync = mkdirSync;

export default fs;

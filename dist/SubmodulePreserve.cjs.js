/*!
 * git-submodule-preserve v1.0.0
 * Erdem Bircan - 2019
 * @license MIT
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var process = require('process');

function __async(g){return new Promise(function(s,j){function c(a,x){try{var r=g[x?"throw":"next"](a);}catch(e){j(e);return}r.done?s(r.value):Promise.resolve(r.value).then(c,d);}function d(e){c(e,1);}c();})}

/*!
  * fancy-terminal v1.0.1
  * Erdem Bircan - 2019
  * @license MIT
  */

/** @module colors */
var colors = {
  colors: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    blackBg: '\x1b[40m',
    redBg: '\x1b[41m',
    greenBg: '\x1b[42m',
    yellowBg: '\x1b[43m',
    blueBg: '\x1b[44m',
    magentaBg: '\x1b[45m',
    cyanBg: '\x1b[46m',
    whiteBg: '\x1b[47m',
  },
  util: {
    reset: '\x1b[0m',
  },
};

/** fancyObject - fancy-terminal main object */
var fancyObject = {};

var ref = colors.util;
var reset = ref.reset;

/**
 * @function assignColor - assign color key to main object as function
 *
 * @param {string} colorKey - color key
 */
function assignColor(colorKey, colorObj, mainObj) {
  mainObj[colorKey] = function assign(message) {
    return ("" + (colorObj[colorKey]) + message + reset);
  };
}

Object.keys(colors.colors).forEach(function (c) {
  assignColor(c, colors.colors, fancyObject);
});

var fancyTerminalCommon = fancyObject;

var logUtils = {
  logError: function (message) {
    console.log(((fancyTerminalCommon.redBg('Error:')) + " " + (message.trim())));
  },
  logInfo: function (message) {
    console.log(((fancyTerminalCommon.blueBg('Info:')) + " " + (message.trim())));
  },
};

/** @module logUtils */
var logUtils_1 = logUtils;

/** @typedef _options
 *  @prop {boolean} [debugLog] - log messages to console
 */
var _options = {
  debugLog: false,
};

/**
 * parse user options and merge with default ones
 * @param {object} [userOptions] - user options object
 */
function _parseOptions(userOptions) {
  if (typeof userOptions === 'object') {
    Object.keys(_options).forEach(function (key) {
      if (userOptions[key]) {
        _options[key] = userOptions[key];
      }
    });
  }
}

/**
 * delete directory with its child folders and files at the given path
 * @param {string} dirPath - path to directory
 * @param {_options} [options] - options
 */
function removeDirSync(dirPath, options) {
  _parseOptions(options);
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(function (dirName) {
      var currPath = path.join(dirPath, dirName);

      if (fs.lstatSync(currPath).isDirectory()) {
        removeDirSync(currPath);
      } else {
        fs.unlinkSync(currPath);
      }
    });
    fs.rmdirSync(dirPath);
    if (_options.debugLog) { logUtils_1.logInfo(("path cleared [" + dirPath + "]")); }
  } else if (_options.debugLog) { logUtils_1.logError(("invalid path [" + dirPath + "]")); }
}

/** @module folder-delte */
var folderDelete = removeDirSync;

/**
 * logger function
 * @param {string} message message to be outputted to stdout
 * @param {string} [type='info'] message type, possible types are info, warning, success and error
 */
function log(message, type) {
  if ( type === void 0 ) type = 'info';

  var types = {
    info: ['blue', '💡'],
    warning: ['yellow', '⚠️'],
    success: ['green', '✔️'],
    error: ['red', '⛔'],
  };
  var cLog = fancyTerminalCommon[types[type][0]] || fancyTerminalCommon.black;
  process.stdout.write(((fancyTerminalCommon.cyan('[SubmodulePreserve]')) + ": " + (types[type][1] || '') + "  " + (cLog(message)) + "\n"));
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
  return new Promise(function (res, rej) {
    try {
      fs.mkdirSync(to, { recursive: true });
      fs.readdirSync(from).forEach(function (dir) {
        var currSrcPath = path.join(from, dir);
        var currDestPath = path.join(to, dir);
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

var continueOperation = true;

/**
 * nuxt generate:before hook call
 *
 * @async
 * @param {object} nuxt nuxt object
 */
function generateBeforeHook(nuxt) {return __async(function*(){
  var genPath = nuxt.options.generate.dir;
  var ref = nuxt.options;
  var rootDir = ref.rootDir;
  var gitSourcePath = path.join(genPath, '.git');
  var gitDestPath = path.join(rootDir, '.subPreserve', '.git');
  if (fs.existsSync(gitSourcePath)) {
    try {
      folderDelete(path.join(rootDir, '.subPreserve'));
      yield copyDir(gitSourcePath, gitDestPath);
      log('git initialization found');
    } catch (e) {
      log(("an error occured: " + (e.message)));
    }
  } else {
    log('no git initialization found on generate path', 'warning');
    continueOperation = false;
  }
}())}

/**
 * nuxt generate:done hook call
 *
 * @async
 * @param {object} nuxt nuxt object
 */
function generateDone(nuxt) {return __async(function*(){
  if (continueOperation) {
    var genPath = nuxt.options.generate.dir;
    var ref = nuxt.options;
    var rootDir = ref.rootDir;
    var gitDestPath = path.join(genPath, '.git');
    var gitSourcePath = path.join(rootDir, '.subPreserve', '.git');
    try {
      yield copyDir(gitSourcePath, gitDestPath);
      folderDelete(path.join(rootDir, '.subPreserve'));
      log("operation completed, submodule preserved", 'success');
    } catch (e) {
      log(("an error occured: " + (e.message)), 'error');
    }
  }
}())}

/**
 * entry point for nuxt module logic
 */
function SubmodulePreserve() {
  this.nuxt.hook('generate:before', generateBeforeHook);
  this.nuxt.hook('generate:done', generateDone);
}

// meta export for nuxt npm module
SubmodulePreserve.meta = require('../package.json');

module.exports = SubmodulePreserve;

[
  'path',
  'commander',
  'chalk',
  'leven',
  'semver',
  'ora',
  'console',

//   'exit',
//   'ipc',
//   'logger',
//   'module',
//   'object',
//   'openBrowser',
//   'pkg',
//   'pluginResolution',
//   'pluginOrder',
//   'launch',
//   'request',
//   'spinner',
//   'validate',
].forEach(m => {
  Object.assign(exports, require(`${m}`));
});

// const path = require('path')
// const program = require('commander')
// const chalk = require('chalk')
// const leven = require('leven')
// const { exit } = require('node:process')
// const packageConfig = require('../package.json')
// const commands = require('../lib/commands')
// const { clear } = require('console')

// const semver = require('semver');
// const packageConfig = require('../../package.json');
// const requiredVersion = packageConfig.engines.node;
// const chalk = require('chalk');
// const { ora } = require('ora');

const semver = require('semver');
const packageConfig = require('../../package.json');
const requiredVersion = packageConfig.engines.node;
const chalk = require('chalk');
const ora = require('ora');
const log = console.log;

function checkNodeVersion() {
  if (!semver.satisfies(process.version, requiredVersion, { includePrerelease: true })) {
    log(chalk.red(
      `You are using Node ${process.version}, but this version of ` +
            ` requires Node ${requiredVersion}.\nPlease upgrade your Node version.`,
    ));
    process.exit(1);
  }
}

const loading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  const result = await fn(...args);
  spinner.succeed();
  return result;
};

const getEvt = (envValue) => {
  switch (envValue) {
    case 'test':
      return 'https://test';
    case 'uat':
      return 'https://dev';
    case 'online':
      return 'https://';
    default:
      break;
  }
};
module.exports = {
  checkNodeVersion,
  loading,
  getEvt,
};

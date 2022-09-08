const semver = require('semver')
const packageConfig = require('../../package.json')
const requiredVersion = packageConfig.engines.node
const chalk = require('chalk')
const log = console.log

function checkNodeVersion(){
  if (!semver.satisfies(process.version, requiredVersion, { includePrerelease: true })) {
    log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' +
            ' requires Node ' + requiredVersion + '.\nPlease upgrade your Node version.'
    ))
  }
}



module.exports = {
  checkNodeVersion,
}

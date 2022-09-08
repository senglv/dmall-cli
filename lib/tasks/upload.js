const clear = require('clear')
const log = console.log
const chalk = require('chalk')
const utils = require('../utils/index')
utils.checkNodeVersion()

module.exports = async () => {
  clear()
  log(chalk.green('欢迎使用Dmall OS专业版商家小程序上传工具。'))
}

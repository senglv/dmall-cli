const clear = require('clear');
const log = console.log;
const chalk = require('chalk');
// const { config, questions, templateList } = require('../constant');
const { checkNodeVersion } = require('../utils/index');
checkNodeVersion();

module.exports = async () => {
  clear();
  log(9999);
  log(chalk.green('欢迎使用Dmall OS专业版商家小程序上传工具。'));
};

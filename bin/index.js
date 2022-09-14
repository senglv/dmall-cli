#! /usr/bin/env node

const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
// const leven = require('leven');
const packageConfig = require('../package.json');
const commands = require('../lib/commands');
const log = console.log;

Reflect.ownKeys(commands).forEach((commandKey) => {
  program
    .command(commandKey)
    .alias(commands[commandKey].alias)
    .description(commands[commandKey].description)
    .action(() => {
      console.log('process.argv',process.argv);
      if (commandKey === '*') {
        log(chalk.red(commands[commandKey].description));
      } else {
        require(path.resolve(__dirname, `../lib/tasks/${commandKey}.js`))(...process.argv.slice(3));
      }
    });
});

// 监听用户 help事件
program.on('--help',() => {
  log(chalk.green(figlet.textSync('welcome～', { horizontalLayout: 'full' })));
  log(chalk.yellow('\nExamples'));
  Reflect.ownKeys(commands).forEach((commandKey) => {
    commands[commandKey].examples.forEach((example) => {
      log(`${example}`);
    });
  });
});

program
  .version(packageConfig.version, '-v, --version') // 定义脚手架版本号
  .parse(process.argv); // 解析 参数

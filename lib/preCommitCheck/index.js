const chalk = require('chalk');
const { exec } = require('child_process');
const path = require('path');
const processEnv = process.env;
const delevoperName = processEnv.LOGNAME.split('.')[0];

const suggestionBranchNameRexg = new RegExp(`^main${delevoperName}$`,'i');

const result = (shCommand, fn) => {
  exec(shCommand, function(err, stdout, stderr) {
    if (err) {
      return fn(new Error(err), null);
    } else if (typeof (stderr) !== 'string') {
      return fn(new Error(stderr), null);
    } else {
      return fn(null, stdout);
    }
  });
};

result(`sh ${path.resolve(__dirname)}/git.sh`, function(err, response) {
  if (!err) {
    const currentBranchName = response;
    if (!suggestionBranchNameRexg.test(currentBranchName)) {
      console.log(chalk.red('你的分支名称不符合规范，请修改分支名'));
      process.exit(1);
    }
  } else {
    console.log(err);
  }
});

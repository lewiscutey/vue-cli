#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');

program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    if (!fs.existsSync(name)) {
      inquirer.prompt([
        {
          name: 'description',
          message: '请输入项目描述'
        },
        {
          name: 'author',
          message: '请输入作者名称'
        }
      ]).then((answer) => {
        const spinner = ora('正在下载模板...');
        spinner.start();
        download('https://github.com/lewiscutey/node-demo.git', process.cwd(), name, {clone: true}, (error) => {
          if (error) {
            spinner.fail();
            console.log(symbols.error, chalk.red(error));
            return;
          } else {
            spinner.succeed();
            const fileName = `${name}/package.json`;
            const meta = {
              name,
              description: answer.description,
              author: answer.author
            };
            if (fs.existsSync(fileName)) {
              const content = fs.readdirSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            console.log(symbols.success, chalk.green('项目初始化完成！'));
          }
        });
      })
    } else {
      console.log(symbols.error, chalk.red('这个项目已存在！'));
    }
  });

program.parse(process.argv);

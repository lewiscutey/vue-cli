'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = (metadata = {}, dest = '.') => {
 	co(function *() {
  	let tplName = yield prompt(chalk.blue('Template type(m or pc): '))
  	let projectName = yield prompt(chalk.blue('Project name: '))
  	let gitUrl
  	let branch

		if (!config.tpl[tplName]) {
    	console.log(chalk.red('\n × Template does not exit!'))
    	process.exit()
    }
		gitUrl = config.tpl[tplName].url
		branch = config.tpl[tplName].branch

    let cmdStr = `git clone -b ${branch} ${gitUrl} ${projectName}`

	  console.log(chalk.yellow('\n Start generating...'))

	  exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        process.exit()
      }
      console.log(chalk.underline.bold('\n √ Generation completed!'))
      console.log(chalk.blue.bold(`\n cd ${projectName} && npm install \n`))
      process.exit()
	  })
  })
}
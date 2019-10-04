const fs = require('fs')
const glob = require('glob')
const readline = require('readline')
const chalk = require('chalk')
const path = require('path')

module.exports = (api, projectOptions) => {
  api.registerCommand('noalicdn', {
    description: 'check if the src directory has ali cdn css',
    usage: 'vue-cli-service noalicdn [options]',
    options: {
      '--input [dir]': 'specify input directory (default: src)',
    },
    details: 'For more details, see https://github.com/bitmain-frontend/vue-cli-plugin-fontmin'
  }, args => {
    let srcPath = args.input || path.resolve(process.cwd(), 'src/')
    const files = args._ && args._.length
    ? args._
    : glob.sync(`${srcPath}/**/*.@(js|vue)`)
    files.forEach(f => {
      let lineNumber = 0
      let lineReader = readline.createInterface({
        input: fs.createReadStream(f),
      })

      lineReader.on('line', line => {
        lineNumber++
        if (line.includes('at.alicdn.com') && !line.trim().startsWith('//')) {
          console.log(
            chalk.red(`
              The remote alicdn css font is not allowed to commit into git! Please use local iconfont files! \n
              ${f}\n
              ${lineNumber} : ${line}
              `)
          )
          process.exitCode = 1
        }
      })
    })
  })
}

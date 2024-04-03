import ejs from 'ejs'
import * as fs from 'node:fs'
import * as path from 'node:path'

const pushEjsPath = path.resolve(__dirname, './template/ssh/push.ejs')
ejs.renderFile(pushEjsPath, { filePath: 'hello' }, null, (_, str) => {
  fs.writeFileSync(path.resolve(__dirname, './out/push.js'), str)
})

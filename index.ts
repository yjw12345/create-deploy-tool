import ejs from 'ejs'
import * as fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__dirname)

const pushEjsPath = resolve(__dirname, './template/ssh/push.ejs')
console.log(pushEjsPath)
const pushEjsTemplate = fs.readFileSync(pushEjsPath, 'utf-8')
ejs.renderFile(pushEjsPath, { filePath: 'hello' }, null, (_, str) => {
  fs.writeFileSync(resolve(__dirname, './output.js'), str)
})

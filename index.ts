import ejs from 'ejs'
import * as fs from 'node:fs'
import * as path from 'node:path'
import prompts from 'prompts'
import deepMerge from './utils'
import { green, bold } from 'kolorist'
async function init() {
  let result: ServeInfomation = {}
  result = await prompts([
    {
      name: 'severIP',
      type: 'text',
      message: '服务器地址',
    },
    {
      name: 'username',
      type: 'text',
      message: '服务器登录用户名',
    },
    {
      name: 'password',
      type: 'text',
      message: '服务器登录密码',
    },
    {
      name: 'filePath',
      type: 'text',
      message: '服务器部署目录',
    },
  ])
  const pushEjsPath = path.resolve(__dirname, './template/ssh/push.ejs')
  // 如果没有这个目录的话就创建
  const dir = path.resolve(__dirname, './config')
  if (!fs.existsSync(dir)) {
    console.log('该路径已存在');
    fs.mkdirSync(dir);
  }
  // 使用ejs渲染ejs文件
  ejs.renderFile(pushEjsPath, result, null, (_, str) => {
    fs.writeFileSync(path.resolve(__dirname, './config/push.js'), str, {})
  })
  // 复制zip.js文件
  const pushZipPath = path.resolve(__dirname, './template/ssh/zip.js')
  const pushZipStr = fs.readFileSync(pushZipPath)
  fs.writeFileSync(path.resolve(__dirname, './config/zip.js'), pushZipStr)
  // 更新package.json
  const packageJSONPath = path.resolve(__dirname, './template/ssh/package.json',)
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))
  const oldPackageJsonPath = path.resolve(__dirname, './package.json')
  const oldPackageJson = JSON.parse(fs.readFileSync(oldPackageJsonPath, 'utf-8'))

  deepMerge(oldPackageJson, packageJSON)
  fs.writeFileSync(oldPackageJsonPath, JSON.stringify(oldPackageJson, null, 2) + '\n')

  console.log(`  ${bold(green('请使用npm install重新安装依赖'))}`)
}
init()


#!/usr/bin/env node

import ejs from 'ejs'
import * as fs from 'node:fs'
import * as path from 'node:path'
import prompts from 'prompts'
import deepMerge from './utils'
import { green, bold } from 'kolorist'
import execa from 'execa'
async function init() {
  // 获取用户输入，获取结果
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
    {
      name: 'commit',
      type: 'confirm',
      message: '是否需要git自动提交',
    },
  ])
  // 获取项目运行地址
  const projectRoot = process.cwd()
  const templateRoot = __dirname

  const pushEjsPath = path.resolve(templateRoot, './template/ssh/push.ejs')
  // 如果没有这个目录的话就创建
  const dir = path.resolve(projectRoot, './scripts')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // 使用ejs渲染ejs文件
  ejs.renderFile(pushEjsPath, result, null, (_, str) => {
    fs.writeFileSync(path.resolve(projectRoot, './scripts/push.js'), str, {})
  })
  // 复制zip.js文件
  const pushZipPath = path.resolve(templateRoot, './template/ssh/zip.js')
  const pushZipStr = fs.readFileSync(pushZipPath)
  fs.writeFileSync(path.resolve(projectRoot, './scripts/zip.js'), pushZipStr)
  // 更新package.json
  const packageJSONPath = path.resolve(templateRoot, './template/ssh/package.json',)
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))
  const oldPackageJsonPath = path.resolve(projectRoot, './package.json')
  const oldPackageJson = JSON.parse(fs.readFileSync(oldPackageJsonPath, 'utf-8'))

  deepMerge(oldPackageJson, packageJSON)
  fs.writeFileSync(oldPackageJsonPath, JSON.stringify(oldPackageJson, null, 2) + '\n')
  // 复制git

  // 复制zip.js文件
  const pushGitCommitPath = path.resolve(templateRoot, './template/git/commit.cjs')
  const pushGitCommitStr = fs.readFileSync(pushGitCommitPath)
  fs.writeFileSync(path.resolve(projectRoot, './scripts/commit.cjs'), pushGitCommitStr)
  // 更新package.json
  mergePackageJSON(path.resolve(templateRoot, './template/git/package.json'), path.resolve(projectRoot, './package.json'))
  // 更新依赖
  console.log(`${bold(green('正在使用npm install重新安装依赖'))}`)
  execa.commandSync("npm install", {
    stdio: "inherit",
    cwd: projectRoot,
  });
}
init()

const mergePackageJSON = (templateDest: string, projectDest: string) => {
  const existFlag = fs.existsSync(templateDest)

  const templatePackageJson = existFlag ? JSON.parse(fs.readFileSync(templateDest, 'utf-8')) : {}
  const projectPackageJson = JSON.parse(fs.readFileSync(projectDest, 'utf-8'))
  deepMerge(templatePackageJson, projectPackageJson)
  fs.writeFileSync(projectDest, JSON.stringify(projectPackageJson, null, 2) + '\n')
}
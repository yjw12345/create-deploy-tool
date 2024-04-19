#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import prompts from 'prompts'
import { green, bold } from 'kolorist'
import execa from 'execa'
import { renderTemplate } from './utils/renderTemplate'

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
    {
      name: 'openapi',
      type: 'confirm',
      message: '是否需要openapi',
    },
  ])
  // 获取项目运行地址，和脚本模版地址
  const projectRoot = process.cwd()
  const templateRoot = path.resolve(__dirname, './template')
  // 创建scripts目录
  const dir = path.resolve(projectRoot, './scripts')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const render = function render(templateName: string) {
    const templateDir = path.resolve(templateRoot, templateName)
    renderTemplate(templateDir, projectRoot, result)
  }

  // 根据交互得到的数据进行克隆
  render('ssh')
  if (result.commit) {
    render('git')
  }
  if (result.openapi) {
    render('openapi')
  }

  // 更新依赖
  console.log(`${bold(green('正在使用npm install重新安装依赖'))}`)
  execa.commandSync("npm install", {
    stdio: "inherit",
    cwd: projectRoot,
  });
}
init()


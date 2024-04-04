#!/usr/bin/env zx
import 'zx/globals'

const rootPath = path.resolve(__dirname, '../')
// 进入根目录
cd(rootPath)
// 获取提交记录
await $`git add .`
await $`git commit -m ${'auto commit'}`
await $`git push`
import * as fs from 'node:fs'
import * as path from 'node:path'
import deepMerge from './deepMerge'
import sortDependencies from './sortDependencies'
import ejs from 'ejs'
// src是模版文件，dest是目标文件，serverInformation是用户输入的值
export const renderTemplate = (src: string, dest: string, serverInformation: ServeInfomation) => {
    const stats = fs.statSync(src)
    // 对目录下的文件进行遍历
    if (stats.isDirectory()) {
        if (path.basename(src) === 'node_modules') {
            return
        }
        fs.mkdirSync(dest, { recursive: true })
        for (const file of fs.readdirSync(src)) {
            renderTemplate(path.resolve(src, file), path.resolve(dest, file), serverInformation)
        }
        return
    }

    const filename = path.basename(src)
    if (filename === 'package.json' && fs.existsSync(dest)) {
        // 将package.json对象合并
        const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
        const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'))
        const pkg = sortDependencies(deepMerge(existing, newPackage))
        fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n')
        return
    }
    if (filename.endsWith('.ejs')) {
        console.log(dest.replace(/\.ejs$/, ''));
        ejs.renderFile(src, serverInformation, null, (_, str) => {
            fs.writeFileSync(dest.replace(/\.ejs$/, ''), str, {})
        })
        return
    }
    fs.copyFileSync(src, dest)
}
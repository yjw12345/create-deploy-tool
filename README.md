### 使用介绍
本项目脚手架做无件事情
- 收集部署项目的地址，部署文件地址，用户名，密码
- 将收集到的信息使用ejs填充推送的脚本，克隆打包脚本。将两份脚本都放在项目下面的config文件夹
- 更新package.json，增加ssh2和archiver的库，分别是用于推送和打包的库
- 使用npm install命令重新下载

## 本项目已经发布npm包
- 使用方法：npm create deploy-tool
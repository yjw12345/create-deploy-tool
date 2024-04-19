const { join } = require('path')
const { exec } = require('child_process'); // 引入child_process模块
const resolve = (src) => join(__dirname, src)

fs.copyFileSync(resolve('../outfile.cjs'), resolve('../playground/outfile.cjs'))
exec(`zx ./playground/outfile.cjs`, (error, stdout, stderr) => {
    console.log(error, stdout, stderr);
    if (error) {
        console.error(`执行命令时出错： ${error.message}`);
    }
    if (stderr) {
        console.error(`命令执行错误： ${stderr}`);
    }
    console.log(`运行成功： ${stdout}`);
    // 不加close，则不会结束question
});
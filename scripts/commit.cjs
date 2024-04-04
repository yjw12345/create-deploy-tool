const { exec } = require('child_process'); // 引入child_process模块
const readline = require('readline');

// 编辑Git提交内容
// 创建readline接口实例
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const editGitCommit = () => {
    // 调用接口方法
    r1.question('输入提交的内容\t', (inpt) => {
        console.log('提交中......');
        exec(`git add . && git commit -m "${inpt}" && git push`, (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
            if (error) {
                console.error(`执行命令时出错： ${error.message}`);
            }
            if (stderr) {
                console.error(`命令执行错误： ${stderr}`);
            }
            console.log(`Git 提交成功： ${stdout}`);
            // 不加close，则不会结束question
            r1.close();
        });
    });
};
editGitCommit()
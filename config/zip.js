// 运行代码，删掉dist.zip。或者看看能不能直接覆盖掉
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 使用 path 模块来构建文件的相对路径

const sourceFolder = path.join(__dirname, '../dist'); // 源文件夹的路径
const zipFilePath = path.join(__dirname, '../dist.zip'); // 输出的ZIP文件路径

const output = fs.createWriteStream(zipFilePath);
// 声明
const archive = archiver('zip', {
  zlib: { level: 9 }, // 压缩级别，0-9，9表示最高压缩率
});

output.on('close', () => {
  console.log('ZIP 文件已创建:', `${archive.pointer()} 字节`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

archive.directory(sourceFolder, false); // 将源文件夹及其内容添加到ZIP文件中

archive.finalize();

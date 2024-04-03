// 引入scp2
const client = require('scp2');
const ssh2 = require('ssh2');

const { Client } = ssh2;
// unzip -o -d /clothing/vue/dist /clothing/vue/dist.zip
const server = {
  path: 'hello', // 项目路径
  host: '183.56.232.130', // 服务器ip
  port: '22', // 端口一般默认22
  username: 'root', // 用户名
  password: 'itaem04008!', // 密码
  locaPath: './dist.zip', // 本地dist压缩包
};
const conn = new Client();

console.log('正在建立连接');
// 建立连接的
// 删除文件
const rimraf = () => {
  conn.exec(`rm -rf ${server.path}/*`, (err, stream) => {
    stream.on('close', () => {
      console.log(`已删除旧文件，开始上传`);
      // 上传
      upload();
    });
  });
};
// 上传
const upload = () => {
  client.scp(
    server.locaPath,
    {
      host: server.host,
      port: server.port,
      username: server.username,
      password: server.password,
      path: server.path,
    },
    (err) => {
      if (!err) {
        console.log('压缩包上传成功');
        // 解压
        unzip();
      } else {
        console.log('err', err);
      }
    },
  );
};
// 解压
const unzip = () => {
  conn.exec(`unzip -o -d ${server.path}/dist ${server.path}/dist.zip`, (err, stream) => {
    stream.on('close', () => {
      console.log('解压成功');
      console.log('项目部署成功');
      // 结束
      end();
    });
  });
};
// 结束运行
const end = () => {
  conn.end();
  process.exit();
};
conn
  .on('ready', () => {
    console.log('已连接');
    // 解压
    rimraf();
    return null;
  })
  .connect({
    host: server.host,
    port: server.port,
    username: server.username,
    password: server.password,
    // privateKey: '' // 私秘钥
  });

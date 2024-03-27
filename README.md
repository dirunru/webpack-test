# 从0-1学习webpack，搭建一个能够运行的项目
- 新建webpack.config.js
- npm install --save-dev webpack webpack-cli webpack-dev-server
- npm init 指令创建项目描述文件 package.json文件。
    ```
    name 项目名称,不填则默认更目录
    version 项目的版本号,不填则默认1.0.0
    description 项目的描述信息
    entry point 项目的入口文件,不填则默认index.js,后面可以修改
    test command 项目启动时脚本命令
    git repository 如果你有 Git 地址，可以将这个项目放到你的 Git 仓库里
    keywords 关键词
    author 作者叫啥
    license 项目要发行的时候需要的证书，平时玩玩忽略它
    ```
- 根目录webpacktest新建app.js, src(css、html、js、ts、scss、less、es6)
- 实现CSS打包：本地安装所需的加载器
  ```
  npm install css-loader style-loader --save-dev
  ```
  ```
  const path = require('path');  // 首先要引入node.js中path 模块，用于处理文件与目录的路径

  // const 命令声明一个只读的常量，一旦声明，值不可以改变，改变会报错；只声明不赋值也会报错
  // 常量存储的是一个不可以变化的变量。
  // 
  module.exports = {
      entry:'./src/./js/main.js', // 指定入口文件
      output:{
          path: path.resolve(__dirname, './dist/js'), // 指定出口文件的路径目录
          filename: 'bulid.js' // 制定出口文件的名称
      },
      module:{
          rules:[
          // 在webpack2中，loaders 被替换成了 rules 其实就是loader的规则
              {
                  test: /\.css$/,
                  use: [ 'style-loader', 'css-loader' ]
                  // test 说明了当前 loader 能处理那些类型的文件
                  // use 则指定了 loader 的类型。
                  // 注意：这次因为webpack在读取使用的loader的过程中，是按照从右向左的顺序读取的。
              }
          ]
      }
  }
  ```

  



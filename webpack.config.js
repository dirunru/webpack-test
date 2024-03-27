
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//
const ESLintPlugin = require('eslint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 编译文件时，清理 build/dist 目录，再生成新的

const webpack = require('webpack'); // 访问内置的插件
//webpack.config.js与index.html同级
const path = require('path');
//需要使用包  npm init生成package.json文件
const isProduction = process.env.NODE_ENV === "production"
const isDevelopment = process.env.NODE_ENV === "development"
console.log("print env: ", isProduction)

module.exports = {
  entry: './src/main.js', //入口
  mode: "development",
  context: path.resolve(__dirname, './'),
  output: {
    path: path.resolve(__dirname, 'dist'), //动态获取路径,需要使用包path,   __dirname node中的全局变量
    filename: '[name].[hash].js', // 防止文件缓存（生成带有20位的hash值的唯一文件）:将入口文件重命名为带有20位的hash值的唯一文件
  }, //出口
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      `...`,
      new CssMinimizerPlugin({
        parallel: true,//使用多进程并发执行，
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },//移除所有注释
            },
          ]
        }
      }),
    ]
  },
  // webpack-dev-server提供了一个简单的 web 服务器，并且能够实现热加载 并且自动刷新浏览器，
  // html-webpack-plugin插件根据html模板在内存生成html文件，它的工作原理是根据模板文件在内存中生成
  // 一个index.html文件。这样的话，即使我们的目录中没有了相关js等文件，还能够加载出来，这样能够提高我们
  // 页面运行速度。
  devServer: {
    // 为哪一个文件夹提供本地服务，默认是根文件夹，我们这里要填写./dist
    // contentBase: path.join(__dirname, "./dist"),
    compress: true,
    open: true,//自动开启浏览器
    // 当它被设置为true的时候对所有的服务器资源采用gzip压缩
    // 对JS，CSS资源的压缩率很高，可以极大得提高文件传输的速率，从而提升web性能
    port: 8000, // 如果想要改端口，可以通过 port更改
    hot: true, // 启用 webpack 的模块热替换特性()\//启动热更新
    //仅启动HMR，就算是宕机状态 live reload,浏览器也不会刷新页面
    // hotOnly: true,
    // host: "localhost", // 如果你希望服务器外部可访问，指定使用一个 host。默认是 localhost(也就是你可以不写这个host这个配置属性)。
    //前端解决跨域问题，也可以后端解决，直接加入访问白名单，但是可能会存在安全问题
    //	使用api来解决后端多个接口不同的问题
    proxy: [
      {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: {
            '^api': ''
          }
        }
      }
    ]
  },
  module: {
    rules: [
      {
        // 正则表达式 匹配所有的css文件，css-
        test: /\.css$/,
        // css-loader只负责将css文件进行加载
        //style-loader负责将样式添加到DOM中
        //使用多个loader时，是从右向左使用
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // 实现less打包
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      // ts
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: "/node_modules/"
      },
      // 实现scss打包
      {
        test: /\.s[ca]ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: path.resolve(__dirname, 'node_modules'), // 排除node_modules目录下的文件
      },
      // 实现 url 资源打包
      {
        // 图片和字体文件使用 url-loader 来处理
        test: /\.(png|jpg|gif|jpeg|ttf|eot|woff|woff2|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              //当加载的图片小于limit时，会将图片编译成base64字符串的形式,
              //当图片大于这个limit，会用file-loader进行加载
              limit: 13000,
              esModule: false,
              //这个表示在打包生成的文件的名字，如果不配置这个，会根据hash生成一个名字，这个配置就是自定义命名规则
              //这个表示会在输出文件夹dist下创建一个img文件夹，所有的文件会以 “原名字+hash值8位+文件扩展名”生成最终的文件来供使用
              name: "static/images/[name].[hash:8].[ext]",
            },
          },
        ],
        type: 'javascript/auto'
      },
      // es6转js
      {
        test: '/\.js$/',
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        include: path.resolve(__dirname, 'src') // 只命中src目录中的js文件，加快webpack搜索速度
      }
    ]
  },
  resolve: {
    /* 为路径取别名 引入时更直观方便  import A from '../../utils/a' => import A from 'utils/a'*/
    alias: {
      utils: path.resolve(__dirname, 'src/utils/'),
      '@/': path.resolve(__dirname, 'src/')
    },
    extensions: ['.ts', '.js', '.json'] // 优先使用目录下的类型文件，默认：['.js', '.json']
  },
  devtool: isProduction ? 'source-map' : false,//生产环境关闭sourcemap
  // plugins: webpack中的插件，就是对webpack现有功能的各种扩展，比如打包优化，文件压缩等等
  plugins: [
    // plugins配置,插件一般是构造函数，需要使用new来创建实例
    new CleanWebpackPlugin({
      path: path.join(__dirname, 'build')
    }),
    // 传参是一个选项，里面可以设置一些需要的配置
    new ESLintPlugin({
      // context就是需要检查的文件目录，使用绝对路径,其他配置可以看官网
      context: path.resolve(__dirname, '../src'),
    }),
    // 生成dist中的html文件
    new HtmlWebpackPlugin({
      title: '首页', // 用于生成的HTML文档的标题  
      filename: 'index.html', //写入HTML的文件。默认为index.html。也可以指定一个子目录（例如：）assets/admin.html
      template: 'index.html' // Webpack需要模板的路径
    }),
    // 提取css
    new MiniCssExtractPlugin({
      // 配置输出的样式文件路径和名字，不配置就会直接默认在dist目录中
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new CssMinimizerPlugin(),

    new webpack.HotModuleReplacementPlugin()// 需要结合 启用热替换模块(Hot Module Replacement)，也被称为 HMR

  ],
  externals: {
    //key 是我们需要进行外部扩展的包名，后续打包时不会将该包打包，
    //value 是该库声明的全局变量 jquery $
    jquery: '$'
  }
}
if (isProduction) {
  pluginsProduction = [
    // 20230216 代码压缩
    new UglifyJsPlugin({
      parallel: true,// 使用多进程并行以提高构建速度
      sourceMap: true,// 使用源映射将错误信息位置映射到模块（这将会减慢编译速度）。
      // extractComments:true,//启用禁用提取注释
      cache: true,//启用缓存
      uglifyOptions: {
        comments: false,//如果你构建时不想出现注释，可以按照以下配置将 uglifyOptions.output.comments 设置为 false：
      },
    }),

  ]
  module.exports.plugins.push(
    ...pluginsProduction
  )

}
// 常用 plugins：
// html-webpack-plugin：生成 html 文件，并将包添加到 html 中
// p：压缩 js（多进程并行处理压缩）
// happypack：多线程loader，用于提升构建速度
// hard-source-webpack-plugin：为模块提供中间缓存步骤，显著提高打包速度
// webpack-merge：合并 webpack 配置
// mini-css-extract-plugin：抽离 css
// optimize-css-assets-webpack-plugin：压缩 css
// add-asset-html-webpack-plugin：将 JavaScript 或 CSS 资产添加到 html-webpack-plugin 生成的 HTML 中

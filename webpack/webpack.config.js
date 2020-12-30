// webpack 配置文件

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let path = require('path');   // path


console.log(__dirname)    // 当前文件所在文件夹的绝对路径
console.log(__filename)   // 当前文件绝对路径名称
console.log(path.resolve(__dirname,'aaa'))    // 字符串路径合并
module.exports = {
    mode:'development',   // 开发模式。控制生产环境还是开发环境  "development" | "production" | "none"
    entry:'./src/index.js',  // 配置入口
    output:{    // 配置出口
        filename:'wo.[hash].js',   // 默认出口的名字
        path:path.resolve(__dirname,'mydist'),
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:'index.html',
            filename:'aa.html'
        })
    ]
}

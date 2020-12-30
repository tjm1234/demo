let HtmlWebpackPlugin = require('html-webpack-plugin');
let {merge} = require('webpack-merge');
let base = require('./webpack.base.js');
let path = require('path')

module.exports = merge(base,{
    mode:'production',
    plugins:[
        new HtmlWebpackPlugin({
            template:'index.html',
            filename:'test.html',
            title:'test环境',
            hash:true
        })
    ],
    // devServer:{
    //     port:9000,
    //     open:true,
    //    // contentBase:path.resolve(__dirname,'../src'), // 吧public下的文件当做服务器文件
    //     // proxy:{
    //     //    // '/api':'https://baidu.com'
    //     //    '^api':{
    //     //        target:'https://www.baidu.com',
    //     //        pathRewrite:{
    //     //            '^/api':''
    //     //        }
    //     //    }
    //     // }
    // }
})
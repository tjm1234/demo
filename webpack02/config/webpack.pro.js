let HtmlWebpackPlugin = require('html-webpack-plugin');
let {merge} = require('webpack-merge');   // 合并两个模块
let base = require('./webpack.base.js')

module.exports = merge(base,{
    mode:"production",
    plugins:[
        new HtmlWebpackPlugin({
            template:'index.html',
            filename:'pro.html',
            title:'生产环境',
         //   hash:true,
            minify:false,   //是否压缩
            chunks:['other2','common2']
        }),
        new HtmlWebpackPlugin({
            template:'./src/view/other.html',
            filename:'other.html',
            title:'other环境',
         //   hash:true,
            chunks:['other2','common2']
        })
    ]
})
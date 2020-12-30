let htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
let {merge} = require('webpack-merge');
let base = require('./webpack.base.js');
module.exports= merge(base,{
    mode:'development',
    plugins:[
        new htmlWebpackPlugin({
            template:'./src/dev/index.html',
            filename:'index.html'
        }),
        new webpack.ProvidePlugin({   // 要在文件中使用的变量名：安装的包的名字,这样在项目中不用使用 import导入 import xx from ‘aa’ 不用了
            '$$':'jquery'
        })
    ],
    resolve:{   // 可以省略后缀名
        extensions:['.js','.vue','.json','.css','.jsx']   
    },
    devServer:{
        port:9001,
        open:true,
        hot:true
    },
})
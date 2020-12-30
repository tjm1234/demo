let {CleanWebpackPlugin} = require('clean-webpack-plugin');

let MiniCss = require('mini-css-extract-plugin');   // 单独打包css

let TerserWebpackPlugin = require('terser-webpack-plugin');

let optimizeCss = require('optimize-css-assets-webpack-plugin');  // 优化 css样式 压缩

let path = require('path');

let mini = require('css-minimizer-webpack-plugin')

module.exports = {
    //entry:'./src/index.js',   // 单入口
    entry:{
        index2:'./src/index.js',
        other2:'./src/view/other.js',
        common2:'./src/view/common.js'
    },   // 多入口
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'[name].[hash].js'
    },
    plugins:[
        new CleanWebpackPlugin(),
        new MiniCss({
            filename:'css/[name].css'
        }),//  可以吧css单独作为一个文件，然后使用link引用
       
    ],
    module:{
        // css-loader 只是让JS文件认识 ,预编译的(如：less，sass，style)都放在css-loader的后面
        // style-loader 吧处理的JS语法处理成css，style标签插入到页面中
        //loader的顺序是从右往左加载的,从下到上，
        // 在转换为css之前，线吧 postcss-loader加上前缀
        // postcss 的配置步骤  1. 安装postcss和postcss  loader； 
        //          2.在处理css文件之前，先加上 post-loader
        //         3. 配置postcss所需要的配置项 postcss.config.js (需安装postcss-preset-env)
        //        4. 设置浏览器的兼容版本，   browserslistrc
        //       5.配置postcss-preset-env 转换配置文件。
        rules:[
            {test:/\.css$/,use:[MiniCss.loader,'css-loader','postcss-loader']},
            {
                test:/\.less$/,
                use:[
                    MiniCss.loader,
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]  
            },
            {
                test:/\.(jpg|png|gif|jpeg|svg)$/i,   //  i 是不区分大小写
                use:{
                    loader:'url-loader',
                    options:{
                        // 转换为base64可以减少文件的请求，减少http请求。
                        limit:100*1024,    //  限制大小
                        name:'img/[name].[ext]'
                    }
                }
            }
        ]
    },
    optimization:{   // 优化资源
        minimizer:[
            // new optimizeCss(),
            // new TerserWebpackPlugin(),
            new mini()
        ]
    }

}
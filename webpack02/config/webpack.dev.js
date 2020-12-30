let HtmlWebpackPlugin = require('html-webpack-plugin');
let {merge} = require('webpack-merge');
let base = require('./webpack.base.js');
let path = require('path')
let obj = require('../mockApi');
module.exports = merge(base,{
    mode:'development',
    plugins:[
        new HtmlWebpackPlugin({
            template:'index.html',
            filename:'index.html',
            title:'开发环境',
            hash:true
        }),
        new HtmlWebpackPlugin({
            template:'./src/view/other.html',
            filename:'other.html',
            title:'开发环境',
            hash:true
        })
    ],
    devServer:{
        port:9000,
        open:true,
       // contentBase:path.resolve(__dirname,'../src'), // 吧public下的文件当做服务器文件
    //    before:function(app){
    //        app.get('/api/haha',function(req,res){
    //            res.json({custom:'response'});
    //        })
    //        app.post('/api/haha',function(req,res){
    //         res.json({custom:'response'});
    //     })
    //    },
        before:obj.API,  // 模拟mock
       proxy:{
           // '/api':'https://baidu.com'
           '^api':{
               target:'https://www.baidu.com',
               pathRewrite:{
                   '^/api':''
               }
           }
        }
    }
})
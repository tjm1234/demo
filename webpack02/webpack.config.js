let path = require('path');
let HtmlWebpackPlugins = require('html-webpack-plugin');
let { CleanWebpackPlugin } =require('clean-webpack-plugin');
module.exports = {
    mode:'development',
    entry:{
        path:'./src/index.js'
    },
    output:{
        filename:'chunk.[hash:4].js',
        path:path.resolve(__dirname,'res')
    },
    plugins:[
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:['**','!qqq']
        }),
        new HtmlWebpackPlugins({
            title:'wwwww',
            aaaa:'hahahha',
            template:'index.html',
            filename:'hello.html',
            hash:true,
            minify:true,   //是否压缩
        })
    ]
}
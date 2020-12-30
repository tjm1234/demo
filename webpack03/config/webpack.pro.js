let {merge} = require('webpack-merge');
let base = require('./webpack.base.js')
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(base,{
    mode:'production',
    plugins:[
        new HtmlWebpackPlugin(),
    ]

})
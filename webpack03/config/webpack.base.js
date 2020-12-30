let path = require('path');
let {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports={
    mode:'',
    entry:'./src/index.js',
    output:{
        filename:'[name].js',
        path:path.resolve(__dirname,'../dist')
    },
    plugins:[
        new CleanWebpackPlugin()
    ],
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                         presets:['@babel/preset-env'],  //预设
                        // plugins:[
                        //     ["@babel/plugin-proposal-decorators",{legacy:true}],
                        //     ["@babel/plugin-proposal-decorators",{loose:true}],
                        //     ["@babel/plugin-transform-runtime"]
                        // ]
                    }
                }
               
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
        ]
    },
    externals:{   // 外部扩展   过滤需要打包的库
        'jquery':'jQuery'
    },
    // exclude:/node_modules/
}
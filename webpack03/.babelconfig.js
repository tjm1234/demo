module.exports={
    presets:['@babel/preset-env'],  //预设 集合，吧js转换成哪个版本
    plugins:[
        ["@babel/plugin-proposal-decorators",{legacy:true}],
        ["@babel/plugin-proposal-decorators",{loose:true}],
        ["@babel/plugin-transform-runtime",{
            coresjs:3
        }]
    ]
}
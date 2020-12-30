let fs = require('fs');

/**
 * 异步不能使用 try catch
 * fs.readFile
 * paralle 并行  series 串行
 */

 let arr = [];
 let index = 0;
 function fn(data){
     arr.push(data);
     if(arr.length==2)
        console.log(arr);

 }
fs.readFile('name.txt','utf8',function(err,data){
    index++;
    fn(data)
})

fs.readFile('name.txt','utf8',function(err,data){
    index++;
    fn(data)
})

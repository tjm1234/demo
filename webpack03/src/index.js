import $ from 'jquery'
console.log($)
const a = 10;
let b = 12;

class A{
    constructor(){
        this.name ='aaa'
        console.log(A.name)
        console.log(this)
    return this;

    }
    s(){
        this.sub().call(this)
    }
    sub(){
        console.log('333')
    }
}
new A();
console.log(a)
import { a } from './utils/a'; 
import { b } from './utils/b';
import './1.css'
import img from './1.png'
console.log(a)
console.log(b)
let imgs = new Image();
imgs.src = img;
document.body.appendChild(imgs);

let xhr = new XMLHttpRequest();
xhr.open('get','/api/haha')
xhr.send();


let xhr2 = new XMLHttpRequest();
xhr2.open('post','/api/hehe');
xhr2.send();
console.log(a,b)
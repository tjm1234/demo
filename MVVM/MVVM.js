// 入口基类
class MVVM{
	constructor(options){
        this.$el = options.el;   // 获取元素
        this.$data = options.data;   // 获取数据
        this.computed = options.computed;
        this.method = options.method;

        console.log(this)
        // 如果这个根元素存在，则进行模板编译
        if(this.$el) {
             // 吧数据全部转化为Object.defineProperty来定义
            new Observer(this.$data);   // 发布订阅初始化一定要在模版渲染之前监听
            
            this.computedVm(this.computed);   // 属性计算

            this.methodVm(this.method);

            this.proxyVm(this.$data); // 吧数据获取操作  vm上的取值操作都代理到 vm.$data;
           
            new Compiler(this.$el,this);   // 模版渲染
           
        }
    }
    proxyVm(data) {
        for(let key in data) {
            Object.defineProperty(this,key,{   //实现可以通过vm取到对应的内容
                get(){
                    return data[key]   // 进行转换代理操作
                },
                set:(newVal)=> {    //设置代理方法
                    data[key]= newVal;
                }
            })
        }
    }
    computedVm(computed) {
        for(let key in computed) {
            Object.defineProperty(this.$data,key,{
                get:()=>{
                    return computed[key].call(this);
                }
            })
        }
    }
    methodVm(method) {

        for(let key in method) {
            Object.defineProperty(this,key,{
                get:()=>{
                    return method[key];
                }
            })
        }
    }
}
// 模板渲染
class Compiler{
    constructor(el,vm){
        // 此时我们还要判断el是不是元素，如果不是元素，那么就获取他 因为data有可能是字符串，也可能是节点id
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        // 吧当前节点中的元素 放在虚拟内存中，防止重复的回流，减少频繁的操作dom。提高效率
        this.vm = vm;   //  为了全局能用到vm实例
        let fragment = this.nodeFragment(this.el)
        // 吧节点内容进行替换
        // 用数据 ast虚拟dom树编译文档碎片
        this.compile(fragment)
        //吧内存中的内容再塞到页面中
        this.el.appendChild(fragment)
    }
    compile(node){   // 编译虚拟dom树
        let childNodes = node.childNodes;
        node.childNodes.forEach(child=>{
            if(this.isElementNode(child)){  // 判断是否是元素节点或者文本
                //console.log(child,'element')
                this.compileElement(child)
                this.compile(child);
            }else{
              //  console.log(child,'text')
              this.compileText(child)
            }
        })

    }
    isDrirective(attrName){   // 是否是指令
        return attrName.startsWith('v-');
        //return attrName.slice(0,2)=='v-';
    }
    
    compileElement(node){  //编译元素    div span strong 等元素
        let attributes = node.attributes;  // ；类数组
     //   console.log([...attributes]);
        [...attributes].forEach(attr=>{   // 获取属性
            let {name,value:expr} = attr;
          
            if(this.isDrirective(name)) {   // 判断是否是指令 v-model v-html v-bind v-on:change
                let [,directive] = name.split('-');  // v-xxx 
                let [directiveName,eventName] = directive.split(':'); // 分割  on:xxxx
                CompileUtil[directiveName](node,expr,this.vm,eventName);
              //  new CompileUtil(directive,node,expr,vm)
            }

        })
    }
    compileText(node){      //编译文本  {{}} 格式的
        let context = node.textContent;
        if(this.isModelTest(context)) {
            CompileUtil['text'](node,context,this.vm)

        }
    }
    isModelTest(value){   //  判断是否存在 {{}}
        let reg = /\{\{(.+?)\}\}/
        return reg.test(value);
    }
    nodeFragment(node){
        // 创建一个文档碎片
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild=node.firstChild) {
            // appendChild 具有移动性
            fragment.appendChild(firstChild)
        }
        return fragment;
       
    }
    isElementNode(node){   // 是不是元素节点
        return node.nodeType===1;
    } //
}

// 模板处理工具类

CompileUtil = {   // node节点，expr 表达式  vm 是Compiler的实例
    model(node,expr,vm){    // expr   "xxx"
        let fn = this.updater['modelUpdater']
        new Watcher(vm,expr,(newVal)=>{ // 给输入框加一个观察者，如果稍后数据更新了会触此方法，会拿新值给输入框赋值
            fn(node,newVal)
        })
        node.addEventListener('input',(e)=>{   // 视图更新数据
            let value= e.target.value;   //获取用户输入的内容
            this.setVal(vm,expr,value);
        })
        let value = this.getVal(vm,expr);
        fn(node,value)

    },
    html(node,expr,vm){    // expr   "xxx"
        let fn = this.updater['htmlUpdater'];
        let value = this.getVal(vm,expr);
        new Watcher(vm,expr,(newVal)=>{ // 给输入框加一个观察者，如果稍后数据更新了会触此方法，会拿新值给输入框赋值
            fn(node,newVal)
        })
        fn(node,value)
    },
    text(node,expr,vm){   // expr=> {{a}} {{b}} {{c}}
        let fn = this.updater['textUpdater']
        let context = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            new Watcher(vm,args[1],()=>{  // 给表达式{{}} 都加上观察者
              fn(node,this.getContentValue(vm,expr));  // 返回一个全的字符串
            })
            return this.getVal(vm,args[1])
        })
        fn(node,context)
    },
    getContentValue(vm,expr){  // 遍历表达式 将新内容 重新替换成一个完整的内容返还回去
        return expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            return this.getVal(vm,args[1])
        })
    },
    on(node,expr,vm,eventName){   // v-on:click="change"
        node.addEventListener(eventName,(e)=>{
            // 当前实例上的方法的
            console.log(vm[expr])
            vm[expr].call(vm,e);   //   
        })
    },
    updater:{
        modelUpdater(node,value){
            node.value = value;
        },
        htmlUpdater(node,value){  //  html的值获取通过 innerHTML
           node.innerHTML = value;
        },
        textUpdater(node,value) {    //  文本的值获取通过 textConent
            node.textContent = value;
        }
    },
    getVal(vm,expr){   //  vm.$data   value:  shop.good  根据表达式取到对应的数据。
        return expr.split('.').reduce((data,cur) => {
            return data[cur];
        },vm.$data);
    },
    setVal(vm,expr,value) {   // vm.$data   
        return expr.split('.').reduce((data,cur,index,arr)=>{
            if(arr.length-1==index) {
                data[cur] = value;
            }
            return data[cur]
        },vm.$data);
    }
}

//双向数据监听，
class Observer{
    constructor(data){
        this.observer(data)
    }
    observer(data){    // 观察者 监听数据对象
        // 如果是对象才进行观察
        if(data &&  typeof data =='object') {
            for(let key in data) {
                this.defineReactive(data,key,data[key])
            }
        }
       // 
    }
    defineReactive(obj,key,value){    // 实现数据劫持
        this.observer(value)   // 遍历每一个元素进行观察
        let dep = new Dep()  // 给每一个属性都加上一个具有发布订阅的功能。
        Object.defineProperty(obj,key,{
            get:()=>{
                // 如果有数据发布，那么就取值放到全局的watcher中。
                Dep.target && dep.addSub(Dep.target);
                

                return value;    // 依赖收集  取值
            },
            set:(newVal)=>{
                if(newVal!=value) {
                    this.observer(newVal)
                    value = newVal;     // 观察和监听新数据
                    dep.notify();    // 对每一个元素通知，数据变化通知视图
                }
            }
        })
    }
}

// 观察者模式  观察 被观察者  update
class Watcher{
    constructor(vm,expr,cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldValue = this.get();
    }
    get(){   //  获取 vm.$data.xxx
        Dep.target= this;   //先把自己放在this上，
        //取值 把观察者和数据关联起来
        let value = CompileUtil.getVal(this.vm,this.expr);
        Dep.target = null;  // 再吧target去调调。
        return value;
    }
    update(){   // 更新操作 数据变化后， 会调用观察者的update方法
        let newVal = CompileUtil.getVal(this.vm,this.expr);
        if(newVal!==this.oldValue) {
            this.cb(newVal);
        }

    }
}

class Dep{   // 发布订阅模式-发送数据变化 到观察者中  通知观察者更新刷剧
    constructor() {
        this.subs = [];   //存放所有的watcher

    }
    addSub(watcher){   // 订阅 添加watcher   
        this.subs.push(watcher)
    }
    notify(){   // 发布   通知消息 更新
        this.subs.forEach(watcher=>{
            watcher.update()
        }); // 
    }
}
// class CompileUtil{
//     constructor(...args){ // node节点，expr 表达式  vm 是Compiler的实例
//         this.args = args;
//         switchcase1.5rem.2rem 0;(this.args[0]){
//             case 'model':
//                 this.model();
//                 break;
//             case 'html':
//                 this.html();
//                 break;
//             default:
//                 console.log('333') 

//         }
//     }
//     model(){    // 给输入框赋值 node.value = xxx;
//         let value = this.getVal(this.args[3],this.args[1])
//         this.updater('modelUpdater',this.args[3],value);
//     }
//     html(){
//         console.log('3')
//     }
//     updater(type){    // 将数据插入到模板中
//         let _arg = null;
//        const modelUpdater =(node,value)=> {
//        } 
//        const htmlUpdater =(node,value)=> {
//        }
//        _arg = {modelUpdater,htmlUpdater}
//        return _arg[type]();

//     }
//     getVal(){
        
//     }
// }


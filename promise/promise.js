(function(window){
    //1.定义promise方法
    
    function PromiseM(excutor){
        this.status = 'pending'   // 1、promise初始状态status是 pending 等待期
        this.data =[];    // 2、初始化数据
        this.callbacks = []    // 2、每个元素的结构：{onResolved(){},onRejected(){}}
        const self = this;

        function resolve(value){

            //1.如果当前状态不是pending,直接结束
            if(self.status=='pending'){
                return;
            }
            //2.否则将状态改为 resolved
            self.status = 'resolved'
            // 3.保存value述职
            self.data = value;
            //4.如果有待执行callback函数，立即异步执行回调函数 onResolved
            if(self.callbacks.length>0) {
                setTimeout(()=>{   // 放入队列中执行所有成功的回调
                    self.callbacks.forEach(callbackObj=>{
                        callbackObj.onResolved(value)
                    })
                })
            }

        }
        function reject(reason){
            //1.如果当前状态不是pending,直接结束
            if(self.status=='pending'){
                return;
            }
            //2.将状态改为 rejected
            self.status = 'rejected'
            // 3.保存 reason数据
            self.data = reason;
            //4.如果有待执行的callback函数，立即异步执行回调函数 onRjected
            if(self.callbacks.length>0) {
                setTimeout(()=>{
                    self.callbacks.forEach(callbackObj=>{
                        callbackObj.onRjected(reason);
                    })
                })
            }
        }
        
        // 3、立即同步执行 excutor    抛出异常
        try{
            excutor(resolve,reject)
        } catch(error) {
            reject(error)
        }
        
    }
    /**
     * Promise 原型对象的then()
     * 指定成功和失败的回调函数
     * 返回一个新的promise对象,结果由onResolved/onRjected执行结果决定
     */
    PromiseM.prototype.then = function(onResolved,onRjected) {
        onResolved = typeof onResolved==='function' ? onResolved:value=>value;
        onRjected = typeof onRjected==='function' ? onRjected:reason=>{throw reason};
        const self = this;
        // 返回一个新的promise对象
        return new PromiseM((resolve,reject)=>{

            /** 
             * 调用指定的回调函数处理
            */
            function handle(callback) {   // 处理
                /**
                * 1.如果抛出异常，return的promise就会失败，
                * 2.如果回调函数返回promise,return 的promise结果就是这个promise的结果。
                *  3.如果回调函数返回是promise,return的promise结果就是这个promise的结果。
                */
                try{
                    const result = callback(self.data)

                    // 如果回调函数返回是promise,return的promise结果就是这个promise的结果。
                    if(result instanceof PromiseM) {
                        result.then(
                            value => resolve(value),  // 当result成功时，让return的promise也成功
                            reason => reject(reason) // 当result失败时，让return的promise也失败
                        );
                    }else {
                        resolve(result)
                    }
                }catch (error) {
                    reject(error)
                }
            }

            //假设当前状态还是pending状态，将成功和失败的回调函数保存起来， 不执行，等待执行器
            if(this.status=='pending') {   // pending
                this.callbacks.push({
                    onResolved(value){
                       // onResolved(self.data)
                       handle(onResolved)
                    },
                    onRjected(reason){
                      //  onRjected(self.data)
                      handle(onRjected)
                    }
                })
            } else if(this.status=='resolved') {    //  resolved 异步执行 并return的promise状态。
                setTimeout(()=>{
                    handle(onResolved)
                   
                })
            } else{    //  reject  异步执行并return的promise状态。
                setTimeout(()=>{
                  //  onRjected(this.data);
                  handle(onRjected)
                })
            }
        });
        
    }

    /**
     * Promise 原型对象的catch()
     * 处理抛错信息
     * 返回一个新的promise对象
     */
    PromiseM.prototype.catch = function(){

    }
    /**
     * Promise函数对象的resolve方法
     * 返回一个指定结果的成功或失败的promise
     */
    PromiseM.resolve = function(value) {
        return PromiseM((resolve,reject)=>{
            if(value instanceof PromiseM){
                value.then(resolve,reject);
            } else {
                resolve(value)
            }
        }) 
    }

    /**
     * Promise函数对象的reject方法
     * 返回一个指定结果的失败promise
     */
    PromiseM.reject = function(reason){
        return new PromiseM((resolve,reject)=>{
            reject(reason)
        })
    }

    /**
     * 返回一个promise，只有当前promise都成功时才成功，否则只要有一个失败的值就失败。
     */
    PromiseM.all= function(promises) {
        const values = new Array(promises.length)  // 用来保存所有成功的value的数组下表
        let resolveCount = 0;
        return new PromiseM((resolve,reject)=>{
            promises.forEach((p,index)=>{
                p.then(
                    value=>{  // 将成功的promise保存到values
                        values[index] = value;
                        resolveCount++;  // 成功的数量加1
                        //如果全部都成功 ，将return promise的成功
                        if(resolveCount===promises.length) {
                            resolve(values)
                        }
                    },
                    reason=>{    // 只要有一个失败了，那么全部return的promise就失败。
                        reject(reason)
                    }
                )
            })
        })
    }

    /**
     * 返回一个promise，第一个成功的结果
     * 
     */
    PromiseM.race = function(promises) {
        return new PromiseM((resolve,reject)=>{
            promises.forEach((p,index)=>{
                p.then(
                    value=>{
                        resolve(value);
                    },
                    reason=>{
                        reject(reason);
                    }
                )
            })
        })
    }

    /**
     * 返回一个promise，它在指定的时间后才确定的结果
     * 
     */
    PromiseM.resolveDelay = function(value,time) {
        return new PromiseM((resolve,reject)=>{
            setTimeout(() => {
                if(value instanceof PromiseM) {
                    value.then(resolve,reject)
                }else {
                    resolve(value)
                }
            }, timeout);
        })
    }

    /**
     * 返回一个promise，它在指定的时间后才失败的结果
     */
    PromiseM.rejectDelay = function(reason,timeout) {
        return new PromiseM((resolve,reject)=>{
            setTimeout(() => {
                reject(reason)
            }, timeout);
        })
    }

    window.PromiseM = PromiseM;
})(window)

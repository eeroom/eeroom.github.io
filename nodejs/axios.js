let axios=require('axios')


/**
 * 注册多个请求拦截器，先注册的后执行
 * 可以多注册几个试一下
 */
axios.default.interceptors.request.use(request=>{
    console.log("请求参数",request.data);
    console.log("请求头",request.headers);
    //全局loading处理，约定要给特定的请求参数值，读取请求参数，如果有这个特定值，就展示loading的gif图片
    //添加一个特定的请求头，这样后续响应拦截器去读取这个特定的请求头，如果能读到，就关闭loading的gif图片
    return request;//一定要返回一个request;
},request=>{

})

/**
 * 注册多个响应拦截器，先注册的先执行
 * 可以多注册几个试一下
 */
axios.default.interceptors.response.use(response=>{
    console.log("响应数据",response.data);
    console.log("响应头",response.headers);
    console.log("响应阶段-请求头",response.config.headers);
    //处理全局loading,读取特定的响应头，如果有，就关闭laoding的gif动画
    return response;//一定要返回数据，这里返回的数据就是后续then方法的参数值
},response=>{

})

/**
 * 因为Promis的机制，then中回调方法产生的异常只能由后面的catch中的回调方法处理，或者由注册windows.onerror全局异常事件进行处理
 * 但是windows.onerror方式拿不到当时的状态信息：请求参数，响应结果。
 * 如果要实现主动地并且精确到接口的异常预警机制，windows.onerror行不通(只能简单的提示用户，上报异常等，但不知道具体哪个接口，当时的请求参数等)
 * 所以这里把then方法替换掉，内部加上catch统一处理axios请求完成后的回调方法中的异常,
 * @param {*} context 包含请求参数，响应结果
 * @returns 
 */
let createErrorHandler=function (context) {
    return {
        get:function (target,key,receiver) {
            let fuc=Reflect.get(target,key,receiver).bind(target);
            if(key!="then")
                return fuc;
            let fucProxy=function (callback) {
                return new Proxy(fuc(res=>{
                    context.result.push(res.data);
                    return res;
                }).then(callback).catch(err=>{
                    console.log("回调异常处理,请求参数：",context.parameter);
                    console.log("回调异常处理,响应内容：",context.result);
                    console.log("回调异常处理,异常内容",err);
                }),createErrorHandler(context));
            }
            return fucProxy;
        }
    }
}

/**
 * 替换原本的post,get方法，目的是把他们的返回值的promis对象的then方法进行了替换
 */
let opost= axios.default.post;
axios.default.post=function () {
    let context={parameter:arguments,result:[]};
    return new Proxy(opost(...arguments),createErrorHandler(context));
}
let oget=axios.default.get;
axios.default.get=function () {
    let context={parameter:arguments,result:[]};
    return new Proxy(oget(...arguments),createErrorHandler(context));
}

/**
 * 演示回调函数中的抛异常
 */
axios.default.post("http://www.baidu.com",{"a":3,"b":"张三"})
    .then(res=>{
        //todo 业务逻辑代码
        return res.data;
    }).then(x=>{
        //todo 业务逻辑代码
        console.log("响应数据",x.data);
        throw new Error("没有请求到预期的数据！")
    })

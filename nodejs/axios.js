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
 * 因为Promis的机制，then中回调方法产生的异常只能由后面的catch中的回调方法处理，或者由注册windows.addEventListener("unhandledrejection")事件监听异常
 * windows.onerror方式监听不到,这种场景下浏览器内部不会调这个方法
 * 但是unhandledrejection方式拿不到请求当时的状态信息：请求参数，响应结果。
 * 如果要实现主动地并且精确到接口的异常预警机制，unhandledrejection行不通(只能简单的提示用户，上报异常等，但不知道具体哪个接口，当时的请求参数等)
 * 所以这里把then方法替换掉，内部加上catch统一处理axios请求完成后的回调方法中的异常,
 * @param {*} context 包含请求参数，响应结果
 * @returns 
 */
let createAxiosInterceptor=function (context) {
    return {
        apply:function (target,ctx,args) {
            let cdata=ctx.all?{reqdata:JSON.stringify(args),result:[]}:context;
            let promise=Reflect.apply(target,ctx,args).then(res=>{
                cdata.result.push(res);
                return res;
            }).catch(err=>{
                let {message,showmsg=false}=err;
                console.log("axios请求和响应数据:",cdata);
                console.log("axios回调方法异常:",err);
                if(showmsg)
                    alert(message);
            })
            promise.then=new Proxy(promise.then,createAxiosInterceptor(cdata));
            return promise;
        }
    }
}

/**
 * 替换原本的post,get方法，目的是把他们的返回值的promis对象的then方法进行了替换
 */
axios.default.post=new Proxy(axios.default.post,createAxiosInterceptor());
axios.default.get=new Proxy(axios.default.get,createAxiosInterceptor());

/**
 * 演示回调函数中的抛异常
 */
 let http=require("http");


 var server=http.createServer(function(req,res){
     console.log("服务端，请求url：",req.url);
     console.log("服务端，请求method：",req.method);
     console.log("服务端，请求headers：",req.headers);
    let lstbuffer=[];
     req.on("data",function (buffer) {
         lstbuffer.push(buffer);
     })
     req.on("end",function (params) {
         let buffer=Buffer.concat(lstbuffer)
         console.log("服务端,请求参数",JSON.parse(buffer));
         res.setHeader("Content-Type","application/json");
         res.end(JSON.stringify({"aget":12,"name":"张三"}));
     })
});

let serverport=8091
server.listen(serverport,"localhost",function(){
    console.log("开始监听...");
    console.log("http://localhost:"+serverport);
    axios.default.post("http://localhost:"+serverport,{"a":3,"b":"张三"})
    .then(res=>{
        //todo 业务逻辑代码
        return res.data;
    }).then(x=>{
        //todo 业务逻辑代码
        console.log("响应数据",x.data);
        throw new Error("没有请求到预期的数据！")
    })
});

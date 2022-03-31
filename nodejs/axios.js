let axios = require('axios')
/**
 * 注册多个请求拦截器，先注册的后执行
 * 可以多注册几个试一下
 */
axios.default.interceptors.request.use(request => {
    console.log("请求参数:", request);
    console.log("请求头:", request.headers);
    //如果直接把所有的请求的请求都搞loading，直接使用axios的loading属性就行,但是很多页面没必要搞loading
    //只有特定的功能操作才有必要搞loading，比如某个耗时提交，或者避免用户重复提交,如果直接用axios的loading，会被其它请求误伤
    //处理办法：约定特定的请求参数名称和值，读取约定的请求参数和参数值，符合约定，才展示loading的gif图片，如果是数据驱动，就修改那个数据
    return request;//一定要返回一个request;
}, request => {

})

/**
 * 注册多个响应拦截器，先注册的先执行
 * 可以多注册几个试一下
 */
axios.default.interceptors.response.use(response => {
    console.log("响应数据:", response.data);
    console.log("响应头:", response.headers);
    console.log("请求信息(请求头和请求数据)-responseinterceptors:", response.config);
    //精准全局loading,读取response.config.data中约定的请求参数和参数值，符合约定，就关闭laoding的gif动画，如果是数据驱动，就修改那个数据
    return response;//一定要返回数据，这里返回的数据就是后续then方法的参数值
}, response => {

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
let createAxiosInterceptor = function (context) {
    return {
        apply: function (target, ctx, args) {
            let cdata = ctx.all ? { reqdata: JSON.stringify(args), result: [] } : context;
            let promise = Reflect.apply(target, ctx, args).then(res => {
                let {status,data,headers:resheader,config={},request}=res;
                let {headers:reqheader}=config;
                cdata.result.push(JSON.stringify(request?{status,data,reqheader,resheader}:res));
                return res;
            }).catch(err => {
                let { message, showmsg = false } = err;
                console.log("axios请求和响应数据:", cdata);
                console.log("axios回调方法异常:", message);
                if (showmsg)
                    alert(message);
            })
            promise.then = new Proxy(promise.then, createAxiosInterceptor(cdata));
            return promise;
        }
    }
}

/**
 * 替换原本的post,get方法，目的是把他们的返回值的promis对象的then方法进行了替换
 */
axios.default.post = new Proxy(axios.default.post, createAxiosInterceptor());
axios.default.get = new Proxy(axios.default.get, createAxiosInterceptor());

/**
 * 演示回调函数中的抛异常
 */
let http = require("http");

let httpserver = http.createServer();
httpserver.on("request", (req, res) => {
    console.log("服务端，请求url：", req.url);
    console.log("服务端，请求method：", req.method);
    console.log("服务端，请求headers：", req.headers);
    let lstbuffer = [];
    req.on("data", function (buffer) {
        lstbuffer.push(buffer);
    })
    req.on("end", function (params) {
        let buffer = Buffer.concat(lstbuffer)
        console.log("服务端,请求参数", JSON.parse(buffer));
        res.setHeader("Content-Type", "application/json;charset=utf-8");
        res.end(JSON.stringify({ "aget": 12, "name": "张三" }),'utf-8');
    })
});
let port = 8091
httpserver.listen(port, "localhost", function () {
    console.log("开始监听...");
    console.log("http://localhost:" + port);
    axios.default.post("http://localhost:" + port, { "a": 3, "b": "张三" }).then(res => {
        //todo 业务逻辑代码
        return res.data;
    }).then(x => {
        //todo 业务逻辑代码
        console.log("响应数据", x);
        throw new Error("没有请求到预期的数据！")
    })
});

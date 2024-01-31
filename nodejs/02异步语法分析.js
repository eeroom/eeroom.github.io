function logvalue(params) {
    return new Promise((x,y)=>{
        setTimeout(() => {
            console.log("logvalue-Parameter",params)
            x(new Date())
        }, params);
    })
}


async function fun1(params) {
    console.log("开始func1")
    let rt1=await logvalue(3000);
    console.log("rt1:",rt1)
    let rt2=await Promise.all([logvalue(3000),logvalue(1000)])
    console.log("rt2:",rt2)
    console.log("结束func1")
    return 33;
}

/**
 * fun1的等价代码
 * @param {*} params 
 */
function fun2(params) {
    console.log("开始func1")
    return new Promise((x,y)=>{
        logvalue(3000).then(rt1=>{
            x(rt1)
        })
    }).then(rt1=>{
        console.log("rt1:",rt1)
        return Promise.all([logvalue(3000),logvalue(1000)])
    }).then(rt2=>{
        console.log("rt2:",rt2)
        console.log("结束func1")
        return 33;
    })
}


// fun1().then(x=>{
//     console.log("func1返回结果",x)
// })

fun2().then(x=>{
    console.log("func2返回结果",x)
})

console.log("starting")
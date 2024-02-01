## vue使用bpmn-js
```
import BpmnView from 'bpmn-js'
import bpmn-js/dist/assets/diagram-js.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css

加载xml和缩放大小的js参照工作流项目中bpmn的使用

```
## 前端模块规范
```
UMD：
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.libName = factory());
}(this, (function () { 'use strict';})));

主干就是匿名函数立即执行：
(function (global, factory){
    //逻辑
}(this,(function (){'use strict';})))
等同于：
(function (global, factory){
    //逻辑
})(this,(function (){'use strict';}))

CommonJs:nodejs的模块遵循此规范
require的核心就是一个包装函数,exports, require, module都是包装函数传递进去的
function wrapper (script) {
    return '(function (exports, require, module, __filename, __dirname) {' + 
        script +
     '\n})'
}
function require(id) {
 var cachedModule = Module._cache[id];
  if(cachedModule){
    return cachedModule.exports;
  }
  const module = { exports: {} }
  // 这里先将引用加入缓存 后面循环引用会说到
  Module._cache[id] = module
  //当然不是eval这么简单
  eval(wrapper('module.exports = "123"'))(module.exports, require, module, 'filename', 'dirname')
  return module.exports
}

```
## 原型链
```
基本数据类型
    直接创建的字符串，数字等值，不使用new运算符
引用类型及其同名的构造函数
    原生引用类型：Object、Array、Date、RegExp、Function
    基本包装类型：String、Number、Boolean
    单体内置对象：Global、Math
    ES6新增引用类型：Map、WeakMap、Set 、WeakSet
对象.prototype
    原型属性，只有类型对象和Function类型的实例对象具有prototype属性，其他的数据对象没有prototype属性
对象.__proto__.__proto__.__proto__。。。
    原型链， 查找对象的某个属性值或方法的时候，如果对象本身没有，就在其__proto__上查找，会按照原型链一直查找，直到__proto__的值为null
    所有对象都具有这个属性，待研究！
new运算符
    等价代码，以var mfunc=new Function()为例：
    var mfunc=分配内存
    mfunc.__proto__=Function.prototype
    myfunction.call(mfunc)
Object
    Object.prototype包含toString，hasOwnProperty，isPrototypeOf等关键方法
    {}的等价代码就是new Object()
    {}的原型链终点：
    {}.__proto__   [Object.prototype，包含toString，hasOwnProperty，isPrototypeOf]
      .__proto__   [null，所有原型链的终点]
Function类型
    Function.prototype包含call，apply，bind等关键方法
    因为Function.prototype.__proto__===Object.prototype，所以可以认为：Function.prototype=new Object()
    Function实例对象的原型链终点：
        Function实例.__proto__  [Function.prototype，new Object()额外添加call,apply等方法]
                    .__proto__  [Object.prototype]
                    .__proto__  [null]
    Function.__proto__===Function.prototype 总是成立（没有特别的意义，好像是为了向下兼容）
    Function自己的原型链终点：
        Function.__proto__  [和Function.prototype的值相同，new Object()，额外添加call,apply等方法]
                .__proto__  [Object.prototype]
                .__proto__  [null]
自定义function
    自定义function.prototype具有默认值，但是不包含call，apply，bind方法
    自定义function.prototype.__proto__===Object.prototype  总是成立！,所以可以认为：自定义function.prototype=new Object()
    自定义function实例对象的原型链终点：
        自定义function实例.__proto__  [自定义function.prototype，new Object()不添加call,apply等方法]
                         .__proto__  [Object.prototype]
                         .__proto__  [null]
    继承原理：修改自定义function.prototype的值，例如：自定义function.prototype=wchfucntion的实例对象
        自定义function实例.__proto__  [wchfucntion的实例对象]
                         .__proto__  [wchfucntion.prototype，new Object()不添加call,apply等方法]
                         .__proto__  [Object.prototype]
                         .__proto__  [null]
    本质是一个Function类型的实例对象，等价于new Function()的执行结果
    所以：自定义function.__proto__===Function.prototype  总是成立！
    自定义function自己的原型链终点：
        自定义functio.__proto__  [Function.prototype，new Object()额外添加call,apply等方法]
                    .__proto__  [Object.prototype]
                    .__proto__  [null]
```
## 复制和粘贴
```
input元素.select()
document.exeCommand("Copy")
    复制的关键，必需借助input元素，执行select()，然后执行浏览器的复制api，等价于手动选中内容然后执行
    对于复制input的type为password时的内容，需要借助障眼法，先把type改为text，复制api执行后，再把type改为password
    
    
```
## vue组件设计原则
```
1、业务组件依赖的数据，由组件自己处理，比如依赖一份列表数据，列表数据如果又是根据其他数据进行变化，则这是一份计算属性，或者由watchEffect监听的响应式数据
2、业务组件的初始化，依赖的列表数据由自己发起请求获取，组件本身绑定的数据则由属性传递进来或者从业务模块中导入进来
3、业务组件的交互，用户点击、输入等操作，会修改组件绑定的属性值
4、对于层级关联的属性值，避免通过watch监听上层级属性，自动修改下层级属性的值
    因为watch只是单纯的监听数据变化，他不知道导致变化的原因！用户操作和初始化都能触发watch
        用户点击操作导致属性变化，通常需要重置下层级属性的值
        初始化的时候导致属性变化，通常不能修改下层级属性的值
    比如一个 省，市，县 三级联动的组件，用户操作导致省变了，就要重置市、县的值，加载用户之前选好的省市县数据，虽然省变了，但不能重置市、县的值
5、数据应该由处理逻辑的js模块中产生，组件导入模块中的数据，这样各个逻辑模块之间可以方便的获取依赖的数据
    如果数据由组件产生，逻辑模块成为纯函数，会导致传递链路很深，当逻辑处理js中需要依赖别的数据时，要把数据从源头组件层层传递进来，非常麻烦和混乱
6、避免消息解耦组建和逻辑模块之间的依赖，没必要，因为js不是强类型，最后只能通过查询事件名称来 知道 事件的订阅方
    A的行为影响B的属性值或其他的，直接在A中调用影响B的函数方法，简单明了
```
## 防抖和节流
```
两类场景：
1、用户点击搜索后，继续连续点击搜索按钮，则后面的连续点击无效，必须等第一次点击的请求返回之后，用户再点击才有效
伪代码如下：
let flag=0
async function searchHandler(){
    if(flag>0) return
    flag=flag+1
    await 请求
    flag=0
}

2、对用户的输入内容进行远程校验，用户连续输入，则以最后一次的输入内容为准，前面的内容不需要发请求进行校验
伪代码如下：
let flag=0
async function validateHandler(){
    flag=flag+1
    let validateInternal=(flagValue){
        window.setTimeout(async ()=>{
            if(flagValue!=flag) return
            await 请求
            if(flagValue!=flag) return
            校验逻辑
            flag=0
        },200)
    }
    validateInternal(flag)
}
```
## apply call bind
```
apply 修改this指向，立即执行
call 修改this指向，立即执行
bind 修改this指向，生成新的function
```
# node-sass sass-loader
```
sass-loader  属于webpack工具链的适配器，一头是webpack,一头是sass编译器
node-sass  sass编译器，把sass和scss文件转换为css文件，已被官方废弃，不兼容高版本Node.js，原理：用node调用c++类库libsass编译sass,性能最高
sass sass编译器，原名dart-sass,node-sass被废弃时，官方把dart-sass改名为sass，兼容高版本node
从node-sass切换到sass，涉及的修改点：
node-sass支持::v-deep和/deep/
sass只支持::v-deep
两者功能等价，全局替换掉/deep/即可
版本匹配列表
|-------------|-----------------|----------------------|-------------|
|   node      |     node-sass   |      sass-loader     |    sass     |
|-------------|-----------------|----------------------|-------------|
|   <8        |  [ ,5.0]        |                      |             |
|             |  4.3.0          |      4.1.1           |             |
|             |  4.7.2          |      7.0.3           |             |
|             |  4.7.2          |      7.3.1           |             |
|             |  4.14.1         |      7.3.1           |             |
|-------------|-----------------|----------------------|-------------|
|    8        |  [4.5.3 , 5)    |                      |             |
|-------------|-----------------|----------------------|-------------|
|    10       |  [4.9 , 6)      |                      |             |
|-------------|-----------------|----------------------|-------------|
|    11       |  [4.10 , 5)     |                      |             |
|-------------|-----------------|----------------------|-------------|
|    12       |  [4.12 , 8)     |                      |             |
|-------------|-----------------|----------------------|-------------|
|    13       |  [4.13 , 5)     |                      |             |
|-------------|-----------------|----------------------|-------------|
|    14       |  [4.14 , ]      |                      |             |
|-------------|-----------------|----------------------|-------------|
|    15       |  [5.0 , 7)      |                      |             |
|-------------|-----------------|----------------------|-------------|
|    16       |  [6.0 , ]       |                      |             |
|             |  6.0.1          |     10.0.1           |   1.59.3    |
|-------------|-----------------|----------------------|-------------|
|    17       |  [7.0 , ]       |                      |             |
|-------------|-----------------|----------------------|-------------|  
```
## 性能优化清单
```
FPI
```
## 自动化测试 selenium
```
https://github.com/SeleniumHQ/selenium/tree/trunk/javascript/node/selenium-webdriver
nodejs v18.5
依赖： geckodriver  selenium-webdriver

const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

(async function () {
  let mydriver = await new Builder().forBrowser(Browser.FIREFOX).build();
  await mydriver.get('https://www.baidu.com');
  await mydriver.findElement(By.id('kw')).sendKeys('c# java', Key.RETURN);
  await mydriver.wait(until.titleIs('百度一下，你就知道'), 1000);
})();
```
## electron
```
```


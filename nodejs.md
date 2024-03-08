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
## 关闭当前选项卡
```
window.location.href="about:blank"
window.close();
```
## 样式和布局
```
屏幕自适应
    @media(max-width=1600) 
    表示with<=1600生效，max-width从大的值开始往下写，主要几档：1600 1440 1200 900
    媒体查询的范围匹配没有短路逻辑，当with为1400的时候，1600和1440都符合，需要1440在后，才能覆盖1600的设置，所以就是从大的开始写
    如果反过来写，则1600的设置覆盖1440的设置，并且所有小于1600的情况下，都会被1600的设置覆盖
    使用min-with则和上面相反
    if else的范围匹配，小于从小的值开始写，大于从大的开始写，因为有短路逻辑
导航栏
    位置：fixed，固定高度
    logo：高度保持一致，vertical-align:bottom，圆形图片：正方形然后 border-radius:50%
    文字垂直居中：line-height和height保持一致，font-size不能为0
    右侧内容：浮动
左侧菜单
    位置：fixed，固定宽度，bottom为0
内容区域
    位置：固定左侧和顶部偏移
    图文混排：设置img的float
    列表：li设置为inline-block，自动向右增长
    背景图片位置：background-position:x轴偏移 y轴偏移，默认值为:0% 0%，%为单位的计算规则:(元素宽度-背景图片宽度)*百分比。0 0等价于left center,50% 50%等价于center center
    背景图片重复：如果元素宽度小于背景图片，则重复无效果
文字换行
    word-break:normal和word-wrap:normal的情况下：
        纯中文：自动换行，一个汉字看做一个单词
        纯英文或纯数字：看做一个单词，不换行
        遇到英文空格或者换行符：会换行
        遇到英文单词和英文空格：在空格处换行且不会断单词
    当文本长度超出容器时，浏览器在单词边界、连字符、音节、标点符号、空格等地方都可以进行换行，这些点即是soft wrap opportunities
    white-space、word-break、word-wrap等多个属性都可以改变文本的换行行为的原因都是改变了soft wrap opportunities，间接导致了换行的变化
word-break：控制文本中单词的换行方式
    normal 是默认值，它根据Unicode规则进行换行
    break-all 允许在单词内部换行
    keep-all 则只在单词边界处换行
word-wrap：允许文本在超过其容器的宽度时自动换行
    normal 是默认值，它按照空格进行换行
    break-word 可以在单词内部进行换行，即使单词很长
    anywhere 可以在任何地方换行
    overflow-wrap 可以在单词周围换行
white-space：
    是否进行空格合并，以及控制空格合并的方式
    是否在soft wrap opportunities（文本中可进行换行的断点位置）处进行文本换行
    浏览器渲染页面时，会把所有的换行符都渲染成空格
    |----------------|--------------------|----------------------|-----------------------|---------------------|
    |                |     换行符          |     空格和制表符      |     文字换行           |     行尾空格        |
    |----------------|--------------------|----------------------|-----------------------|---------------------|
    |    normal      |     合并            |     合并             |       换行            |      删除           |
    |----------------|--------------------|----------------------|-----------------------|---------------------|
    |    nowrap      |     合并            |     合并             |       不换行          |      删除           |
    |----------------|--------------------|----------------------|-----------------------|---------------------|
    |    pre         |     保留            |     保留             |       不换行          |      保留           |
    |----------------|--------------------|----------------------|-----------------------|---------------------|
    |    pre-wrap    |     保留            |     保留             |       换行            |                     |
    |----------------|--------------------|----------------------|-----------------------|---------------------|
    |    pre-line    |     保留            |     合并             |       换行            |      删除           |
    |----------------|--------------------|----------------------|-----------------------|---------------------|
    |    pre-wrap    |     保留            |     保留             |       换行            |                     |
    |----------------|--------------------|----------------------|-----------------------|---------------------|
文字超长：
    text-overflow:ellipsis
    overflow:hidden
透明度：
  opacity:0.5 
  0-完全透明，1-不透明
  场景：遮罩层
```


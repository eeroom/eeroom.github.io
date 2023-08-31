## vue使用bpmn-js
```
import BpmnView from 'bpmn-js'
import bpmn-js/dist/assets/diagram-js.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css

加载xml和缩放大小的js参照工作流项目中bpmn的使用

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

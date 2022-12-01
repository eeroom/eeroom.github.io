## postman关闭自动弹出更新提示框
```
找到postman的安装目录，默认安装位置为：C:/Users/用户/AppData/Local/Postman/app-5.5.0
处理resources/app.asar文件即可，本质上，postman就是基于chrome的定制版程序，定制的功能就在app.asar文件中，以js的方式让chrome执行
处理过程：
    创建一个空的node项目，执行：npm init
    把app.asar复制到项目根目录，
    安装asar工具，执行：npm install asar  
    在package.json中增加一个执行命令，"asar":"asar extract app.asar ./app"
    执行：npm run asar  本质就是解压app.asar这个文件
    修改app/js/requester.js这个文件，找到checkForUpdates这个function,第一行增加return;，就达到屏蔽更新的目的
    把app这个文件夹复制到postman的安装目录的resources目录下，
    把app.asar改成别的文件名做为备份，本质上，postman既会自动加载app.asar，也会自动加载app文件夹，优先级未研究
```
## vue使用bpmn-js
```
import BpmnView from 'bpmn-js'
import bpmn-js/dist/assets/diagram-js.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css
import bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css

加载xml和缩放大小的js参照工作流项目中bpmn的使用

```
## idea
[Visual Studio copy.xml](./config/idea.xml)
```
快捷键
    C:\Users\Deroom\.IdeaIC2019.2\config\keymaps\Visual Studio copy.xml
```
## andorid studio
[Visual Studio copy.xml](./config/idea.xml)  
[init.gradle](./config/init.gradle)
```
快捷键
    C:\Users\Deroom\.AndroidStudio3.3\config\keymaps\Visual Studio copy.xml
避免首次运行自动下载android sdk
    C:\Program Files\Android\Android Studio\bin\idea.properties
    增加一行：disable.android.first.run=true
使用本地gradle
    下载gradle-4.10.2-bin.zip，解压到本地：D:\01Tools\gradle-4.10.2-bin
    把D:\01Tools\gradle-4.10.2-bin增加到PATH，cmd中执行：gradle --version
    gradle本质就是一个普通java程序
依赖包本地缓存路径
    配置环境变量：GRADLE_USER_HOME=D:\Data_Gradle
加速镜像
    D:\01Tools\gradle-4.10.2-bin\init.d\init.gradle
不使用gradle wrapper，太卡了，太臃肿了
    项目根目录下：
    移除：gradle目录，gradlew文件，gradlew.bat文件
    保留：build.gradle文件，gradle.properties文件，setting.gradle文件
    android studio的Setting》Build,Execution,Deployment》Gradle，勾选：Use local gradle distribution
```
## vscode
[keybindings.json](./config/keybindings.json)
```
快捷键
    C:\Users\Deroom\AppData\Roaming\Code\User\keybindings.json
```
## nuget
[NuGet.config](./config/NuGet.config)
```
依赖包本地缓存路径
    C:\Users\Deroom\AppData\Roaming\NuGet\NuGet.config
```
## maven
[settings.xml](./config/settings.xml)
```
依赖包本地缓存
C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2019.2\plugins\maven\lib\maven3\conf\settings.xml
加速镜像
C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2019.2\plugins\maven\lib\maven3\conf\settings.xml
```
## visual studio
[vs2012-快捷键.vssettings](./config/vs2012-快捷键.vssettings)  
[vs2015快捷键.vssettings](./config/vs2015快捷键.vssettings)
```
快捷键
vs2012-快捷键.vssettings
vs2015快捷键.vssettings
```
## firefox
[下载channel-prefs.js](./config/channel-prefs.js)  
[下载policies.json](./config/policies.json)
```
关闭自动更新
C:\Program Files\Mozilla Firefox\defaults\pref\channel-prefs.js
C:\Program Files\Mozilla Firefox\distribution\policies.json
```
# nodejs
```
缓存包目录：
    npm config set cache D:/Data_npm
加速镜像
    npm config set registry https://mirrors.huaweicloud.com/repository/npm/
nodejs工具的镜像地址
    npm config set disturl https://repo.huaweicloud.com/nodejs
Node-Sass的镜像地址
    npm config set sass_binary_site https://repo.huaweicloud.com/node-sass
浏览器引擎驱动镜像地址，如果需要安装Selenium，请点击此处
    npm config set phantomjs_cdnurl https://repo.huaweicloud.com/phantomjs
    npm config set chromedriver_cdnurl https://repo.huaweicloud.com/chromedriver
    npm config set operadriver_cdnurl https://repo.huaweicloud.com/operadriver 
Electron和Python的镜像地址
    npm config set electron_mirror https://repo.huaweicloud.com/electron/
    npm config set python_mirror https://repo.huaweicloud.com/python
设置会被自动写入到全局配置文件：
    C:\Users\Deroom\.npmrc
全局配置文件：
    C:\Users\Deroom\.npmrc
    或者：D:\\01Tools\\node-v10.15.3-win-x64\\etc\\npmrc
npm config list 命令可能卡住，删除C:\Users\Deroom\.npmrc即可解决
```



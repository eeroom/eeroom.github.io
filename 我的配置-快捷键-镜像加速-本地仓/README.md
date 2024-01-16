## idea
```
快捷键
    C:\Users\Deroom\.IdeaIC2019.2\config\keymaps\Visual Studio copy.xml
```
## andorid studio
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
```
快捷键
    C:\Users\Deroom\AppData\Roaming\Code\User\keybindings.json
```
## nuget
```
依赖包本地缓存路径
    C:\Users\Deroom\AppData\Roaming\NuGet\NuGet.config
```



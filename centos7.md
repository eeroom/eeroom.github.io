### 系统版本
```
DVD版：常用的普通安装版，包含大量常用软件
Everything版：包含所有软件组建，体积最大
LiveCD版：光盘系统，可通过光盘启动系统，也可以安装系统，有图像界面，也有终端，有些内容需要联网下载
Minimal版：精简版本，包含核心组建，体积小
NetInstall版：网络安装版本，联网安装系统
虚拟机安装Minimal版本，然后安装dotnet,docker等程序的时候，如果缺少依赖，就去对应的Everything版中找依赖包，避免套娃式更新依赖组件
```
### systemd（对应windows的控制面板）
### 网络
### 目录和文件
### 进程管理
### 安装软件
### 局域网共享
### 环境变量
### jdk
```
绿色版安装jdk11
    二进制包：openjdk网站或者镜像站(华为云镜像等)下载
    解压：tar zxf openjdk-11.0.2_linux-x64_bin.tar.gz -C ./openjdk
    环境变量：修改/etc/profile，末尾增加两行
        export JAVA_HOME=解压后的存放路径，例如/root/openjdk/jdk-11.0.2
        export PATH=${JAVA_HOME}/bin:$PATH
        刷新profile文件或者重启系统：source /etc/profile
    查看jdk版本：java --version
    执行jar包：java -jar xxx.jar
    绿色版的安装优势：二进制包已经包含jdk的所有依赖，和windows上的安装方式完全一致
yum本地安装jdk11
    rpm包：rpm官网下载rpm包
    解析依赖：执行yum localinstall xxx.rpm --nogpgcheck，先不安装，只是查看yum分析出来的依赖组件
    依赖组件：从Everything版中的组件包凑齐jdk的所有组件
    安装：把jdk的rpm包和依赖包放在相同的目录，执行：yum localinstall * --nogpgcheck
    已知问题：centos7.2安装jdk11仅需要更新一个组件，问题不大
```
### tomcat
### dotnet
### docker
```
本地安装：centos7.2和docker1.12版本的发布时间接近，Everything版中的组件满足docker直接和间接依赖的所有组件

```


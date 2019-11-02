# mylib
Linux笔记

## centos6
### 网络设置
#### 本机所有的网卡设备 /etc/udev/rules.d/70-persistent-net.rules  
#### SUBSYSTEM=="net", ACTION=="add", DRIVERS=="?*", ATTR{address}=="00:15:5d:38:67:03", ATTR{type}=="1", KERNEL=="eth*", NAME="eth0"  

#### 各个网卡的配置信息 /etc/sysconfig/network-scripts/ifcfg-eth0  ifcfg-[网卡设备名称，eth0,eth1] 对应网卡设备信息里面的NAME
#### DEVICE=eth0 //对于网卡设备的NAME
#### HWADDR=00:15:5D:38:67:03    //对于网卡设备的ATTR{address}
#### TYPE=Ethernet
#### UUID=bbac13e3-9e0a-449d-aa13-e5e5b072cac4
#### ONBOOT=yes  //这个默认是no,表示开机不启用该网卡
#### NM_CONTROLLED=yes
#### BOOTPROTO=dhcp

### Docker
docker -v
### Docker镜像管理
docker pull 镜像名称  //获取镜像  
docker rmi 镜像ID   //删除镜像  
docker images   //列出所有的镜像  
### 容器管理
docker create 镜像名    //新增容器  
docker rm 容器ID    //删除容器  
docker run 参数  
--name  自定义容器名称  
-d  容器后台运行  
-p  当前系统端口：容器端口  端口映射（容器内部端口映射外部）  
-v  当前系统目录：容器目录   目录映射  
docker run -it --name 容器名称 repository:tag /bin/bash //以交互方式启动

docker exec -i -t 通过docker ps查看的name名 /bin/bash

### 网络管理
默认本机和容器

## centos7
使用界面配置  nmtui  
查看ip信息  ip address  
### centos7 网卡命名规则：
### en： ethernet以太网卡
### o：主板集成网卡
### p：PCI独立网卡
### s：热插拔网卡
### nnn数字：MAC+主板信息（生产唯一序号）
### 如：ifcfg-ens33 （以太热插拔）
### 网卡配置文件：
### /etc/sysconfig/network-scripts/ifcfg-ens33
### DNS配置文件:
### /etc/resolv.conf
### 网络主机绑定IP地址：
### /etc/hosts
### 计算机名：
### /etc/hostname
### 查看内存使用情况 free -m  
### 查看cpu使用情况 top   
### 查看磁盘以及分区情况  df -h   
### 查看端口使用情况     lsof -i:端口号     netstat -apn|grep 端口号 ps -au|grep 端口号

### yum list installed  //查看所有已经安装的程序  
### yum  localinstall docker-engine-selinux-1.12.6-1.el7.centos.noarch.rpm  --nogpgcheck  //本地安装
### uname -r
### pwd 当前所在的位置 printf   working directory
### /bin 命令对应的执行程序
### /dev    设备被抽象成文件
### /etc    系统的配置文件，第三方程序的配置信息
### /home   所有用户的目录
### /lib    动态类库，
### /media  自动挂载
### /mnt    手动挂在
### /root   管理员的一个目录
### /usr    当前用户的软件安装目录
### ls -a列出所有  -l详细信息 -R递归子目录
### 创建目录 mkdir aa/bb/cc -p表示多级目录
### 创建文件    touch
### 删除目录 rmdir 只能删除空目录
### 删除目录或者文件    rm -r表示递归
### 复制命令 cp 源文件/目录 目标文件/目录    -r递归操作（目录情况下）
### 查看文件内容    cat more    less    head    tail
### 修改文件名/文件夹名  mv 源路径 目标路径

### 创建软链接（快捷方式，指向一个硬链接）    ln -s 源文件/源目录    目标路径
### 创建硬链接（并不占用磁盘空间，链接到磁盘地址） ln 源文件 目标路径
### 硬链接相关，查看Inode   stat 文件
### 文件或目录属性  wc 查看文本文件的行数，单词书，字节数   od 查看二进制文件
### du -h   查看目录占用

### 文件的查找和检索，按文件属性    find 路径 -name（按名称查） 文件名称  (通配符*一个或多个字符，?一个字符) -size(按大小查找) + 10k(大于10k) - 10M（小于10M）  如果按大小范围就用两个size -type(安装文件类型查)
### 文件的查找和检索，按照文件内容  grep -r递归 "查找内容" "查找路径"
###文件详细信息解释  d(文件类型)rwx(所有者权限)r-x(所在组权限)r-x(其他用户权限)  7（硬链接数量）  root(所属用户) root(所在的组) 4096（大小）   
### drwxr-xr-x. 7 root   root      4096 Jul  3  2018 dotnet
### 文件类型    普通文件-   目录d   链接符号l   块设备b 字符设备c   socket文件s 管道p

### 修改文件权限 chmod  777 文件或者目录
### 修改所在的组    chown 文件所有者【：文件所属组】 文件或者目录

### 压缩和解压缩    简易版 gzip *.txt ,gunzip a.txt.gz .gz格式的压缩包;  bzip2 .bz2格式压缩包
### 压缩和解压缩    高阶版  tar zcvf xxx.tar.gz *.txt  jcvf xxx.tar.bz2 *.txt  参数解释：c压缩 x解压缩 v显示提示信息 f指定压缩文件的名字 z使用gz的方式压缩 j使用bzip2方式压缩 -C压缩到指定目录，解压缩到指定目录 默认到当前目录

## 进程管理
### ps a当前操作系统的所有用户 u显示用户自己的信息 x没有终端的应用程序 ps aux | grep bash 利用管道检索指定的进程
### who查看当前用户 tty1-tty6文字终端 tty7带桌面的终端 ctrl+alt+f1-f7进行切换 pts/0设备终端
### kill结束进程 -信号 -pid -l列出所有信号
### env 环境变量 env | grep PATH
### top 任务管理器  

## 网络管理
### ifconfig    ping  地址  -c次数      nslookup www.baidu.com

## 用户管理
### 创建用户 adduser 用户名     --这个本质是个脚本，后续会提示设置密码等步骤，非常方便
### 创建用户    useradd  很多参数
### 删除用户    deluser 用户名
### 删除用户    userdel -r 用户名   --这个会把用户对于的桌面文件夹删掉
### 添加用户组  groupadd 组名
### 修改密码    passwd  用户名
### 直接切换用户 su 用户名    
### 查看所有的用户  利用配置文件查看    /etc/passwd
### ssh 用户名@ip 基于服务器openssh-server
### logout  登出
### scp(super copy  基于ssh)
## 挂载 mount  挂载U盘，挂载FTP

## 帮助文档 man man
##  输出指定的字符  echo $PATH      $后面跟一个变量
## 开关机   halt 立刻关机  poweroff 立刻关机  shutdown -h now 立刻关机(root用户使用) shutdown -r now 立刻重启(root用户使用)


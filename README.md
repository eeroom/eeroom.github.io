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

### 程序
yum list installed  //查看所有已经安装的程序  

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


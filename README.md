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


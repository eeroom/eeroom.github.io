##  linux静态库
```
命名规则：lib+库名字+.a ,例如：libazeroth.a
制作步骤：
	1、生成对应的.o文件，gcc ./src/*.c -c -I ./include 
	2、把.o文件打包，ar rcs 静态库名字(libazeroth.a) 所有的.o
发布和使用静态库：.a文件和头文件， 
gcc main.c ./lib/libazeroth.a -I ./include
 (等价写法：gcc main.c -I ./include -L lib -l azeroth)
查看.a文件的内容：nm ./lib/libazeroth.a             nm ./a.out
静态库优点，发布应用程序时，不需要提供.a文件（.a里面的.o内容已经被编译到应用程序中），加载库的速度快
静态库缺点，库被打包到应用程序中，导致应用程序体积较大，如果库升级，应用程序也需要升级
```
##  linux动态库
```
命名规则：lib+库名字+.so,例如：libazeroth.so
制作步骤：
1、生成.o文件（与位置无关的.o文件，程序运行时加载，所以所有的地址都是相对地址，加载位置后的偏移量），
	gcc ./src/*.c -c -fPIC -I ./include      
	与静态库相比，增加参数 -fPIC 或者-fpic,  
2、打包生成.so文件，gcc *.o -shared -I ./include -o libazeroth.so       
	这个和静态库完全不一样
发布和使用动态库：.so文件和头文件， 
gcc main.c -I ./include ./lib/libazeroth.so -o app
（等价写法gcc main.c -I ./include -L lib -l azeroth -o myapp  这样会发生动态库链接失败）
动态库链接失败解决办法
	1、把库放到/lib里面，
	2、export LD_LIBRARY_PATH=./lib,这是把当前的lib目录添加到环境变量，这个修改是临时的，基于当前会话，
	3、修改当前bash的配置文件（这个不推荐）  
	4、修改动态链接器的配置文件，vi /etc/ld.so.conf 增加一行/root/itcast/t4/lib 这个动态库的路径，更新配置ldconfig -v
动态连接器 ldd 应用程序    查看应用程序依赖的所有动态库，动态链接器会自动加载依赖的动态库，按照环境变量里的路径找，
优缺点，类似，应用程序需要包含so.文件
```
## linux-gdb调试
```
todo 调试教程
```
### gcc-makefile
```
makefile的规则，三要素：目标，依赖，命令，下面例子里的所有文件在同一个目录
目标:依赖
    命令
原始版本
app:main.c add.c divid.c
	gcc main.c add.c divid.c -o app
改进版，拆分为子目标
app:main.o add.o divid.o
	gcc main.o add.o divid.o -o app

main.o:main.c
	gcc -c main.c

add.o:add.c
	gcc -c add.c

divid.o:divid.c
	gcc -c divid.c

makefile中的自动变量（只能在命令中使用）
$<	规则中的第一个依赖
$@	规则中的目标
$^	规则中的所有依赖
% 模式匹配

改进版（自定义变量，不需要类型，使用变量：$(变量名称)，使用模式匹配和自动变量）
obj=main.o add.o divid.o
target=app
$(target):$(obj)
	gcc $^ -o $@

%.o:%.c
	gcc -c $< -o $@

makefile中的默认的系统变量，都是大写
CC	值为cc
CPPFLAGS	预编译的时候需要的选项 例如 -I
CFLAGS	编译时使用的参数 例如 -Wall -g -c
LDFLAGS	链接库时使用的选项	-L -l

makefile中的函数
获取指定目录下的.c文件	src=$(wildcard ./*.c)
匹配替换	obj=$(patsubst ./%.c,./%.o,$(src))  这样获取.c对于的.o

改进版 使用函数
src=$(wildcard ./*.c)
obj=$(patsubst ./%.c,./%.o,$(src))
target=app
$(target):$(obj)
	gcc $^ -o $@

%.o:%.c
	gcc -c $< -o $@

clean:
	rm $(obj) $(target) -f

hello:
	echo $(src),$(obj),$(LDFLAGS),$(CC)

make默认生成第一个目标，make clean 这是指定make的目标
```
## linux-gtk
```
安装依赖库 yum install libgnomeui-devel
```
## 编译nginx
```
准备gcc
安装依赖openssl-devel和pcre-devel
官网下载tar.gz包，然后解压
切换到压缩包根目录，执行： ./configure --with-http_stub_status_module --with-http_ssl_module
	执行完configure,就会生成makefile文件，然后就可以执行make
执行：make
执行：make install
	会把主程序和配置文件复制到/usr/local/nginx 目录下

```
## 编译mariadb
```
准备依赖：g++ 编译器和ncurses-devel
cmake . -DCMAKE_INSTALL_PREFIX=/usr/local/mariadb  -DMYSQL_DATADIR=/root/mariadb_data  -DSYSCONFDIR=/etc  -DWITHOUT_TOKUDB=1  -DWITH_INNOBASE_STORAGE_ENGINE=1  -DWITH_ARCHIVE_STPRAGE_ENGINE=1  -DWITH_BLACKHOLE_STORAGE_ENGINE=1  -DWIYH_READLINE=1  -DWIYH_SSL=system  -DVITH_ZLIB=system  -DWITH_LOBWRAP=0  -DMYSQL_UNIX_ADDR=/tmp/mysql.sock  -DDEFAULT_CHARSET=utf8  -DDEFAULT_COLLATION=utf8_general_ci

scripts/mysql_install_db --user=root --datadir=/var/mariadb_data
执行这个脚本会生产配置文件 /etc/my.cnf  等价于windows上 my.ini
	/usr/local/mariadb/support-files 目录下有my.cnf的各种参数值的配置，可以选一个复制到/etc/目录下
启动主进程的脚本文件：/usr/local/mariadb/support-files/mysql.server
	创建一个systmctl服务的声明文件
	[Unit]
	Description=mariadb server daemon
	After=network.target

	[Service]
	User=root
	ExecStart=/usr/local/mariadb/support-files/mysql.server start
	ExecReload=/usr/local/mariadb/support-files/mysql.server restart
	ExecStop=/usr/local/mariadb/support-files/mysql.server stop

	[Install]
	WantedBy=multi-user.target
```
## MSYS2
```
mingw是gcc在windows上的移植，GCC本身是Linux上的编译器套件，不能在windows上运行
mingw有一个配套的命令行环境MSYS
mingw早期只支持编译32位程序，后来分支出的mingw-w64则同时支持编译32/64位程序。
mingw-w64目前的状况比较复杂，有多个发行分支，具体可以参看官网的下载页。目前windows上最新、最靠谱的发行分支就是MSYS2（gcc版本12.1.0-2）。
MSYS2(Minimal SYStem 2)是与mingw-w64配套的命令行环境，它为windows提供了类似linux的命令和包管理器pacman。
pacman原本是ArchLinux的包管理器（就像MacOS上的homebrew和Ubuntu上的apt一样），具体使用办法可以查阅ArchWiki(中文)
git bash实际上是一个删减版的MSYS2，在安装文件夹下可以看到MSYS2的目录结构，但它也没有包管理

MSYS2由6个独立的子环境组成的（早期只有3个子环境）。每个子环境有一个单独的文件夹，和一个专门的命令行界面入口，具体区别见下。
|-----------|----------|-------------|----------------|---------------|---------------------|
|    name   | Prefix   |   Toolchain |  Architecture  |  C Library    |   C++ Library       |
|-----------|----------|-------------|----------------|---------------|---------------------|
|   MSYS    |  /usr    |   gcc       |    x86_64      |    cygwin     |   libstdc++         |
| MingGW32  | /mingw32 |   gcc       |    i686        |    msvcrt     |   libstdc++         |
| MingGW64  | /mingw64 |   gcc       |    x86_64      |    msvcrt     |   libstdc++         |
| UCRT64    | /ucrt64  |   gcc       |    x86_64      |    ucrt       |   libstdc++         |
| Clang32   | /clang32 |   llvm      |    i686        |    ucrt       |   libc++            |
| Clang64   | /clang64 |   llvm      |    x86_64      |    ucrt       |   libc++            |
|-----------|----------|-------------|----------------|---------------|---------------------|
子环境数量由于开发的需要正在增加，将来可能还会加入CLANGARM64(可用于Android程序编译)
安装方式：
	解压msys2-base-x86_64-20221028.tar.xz到目录：D:\01Tools\msys2-base-x86_64-20221028
	首次执行msys2.exe会初始化一些密钥对和配置，需要等待一会
	默认情况下，除了/usr文件夹以外，其它的子环境文件夹里都是空的
每个子环境都有相同的目录结构，关键目录如下：
	bin（含编译器的可执行文件和其他可执行文件等）
	include（标准库和安装的第三方库头文件）
	lib（动态库和静态库等）
MSYS环境
	基础环境
	包含各种linux命令行工具（例如pacman等）
	其它子环境都继承于它
	编译的程序依赖于MSYS2的动态库，因此直接把编译出来的.exe发给其他人的话会无法运行，需要带上/usr/bin文件夹下的MSYS-2.0.dll等依赖库才行
	一般不建议使用，需要完整linux环境的请考虑WSL或者虚拟机
MINGW64环境
	编译的程序不依赖MSYS2，只依赖于windows自带的C语言库msvcrt，较为通用
UCRT64环境
	与MINGW64环境类似，但依赖于比较新的C语言库ucrt，这个库win10/11自带
	新版本Visual Studio的vc也依赖ucrt，
	win7/XP没有ucrt，需要额外安装
	未来将会替代MINGW64环境
CLANG64环境
	使用LLVM工具链而非GCC工具链
	所有配套环境都是基于LLVM的（比如这个环境里的gcc.exe其实是clang.exe的重命名）。
MINGW32环境
	使用32位的mingw工具链，如果没有特殊需求基本不用考虑
CLANG32环境
	使用32位的clang工具链，如果没有特殊需求基本不用考虑

pacman -Ss
  搜索包 
pacman -S 包名 [--downloadonly 仅从远程依赖仓下载到本地目录，不执行安装]
  安装软件，可以同时安装多个包，只需以空格分隔包名即可。
  默认的保存目录：/var/cache/pacman/pkg
  保存到本地的文件都是*.pkg.tar.zst和一个对应的*.pkg.tar.zst.sig，方便打包留着以后进行离线安装
  常用的软件包集合：
	mingw-w64-x86_64-toolchain 整套的编译器和调试器，对应MingGW64子环境
	mingw-w64-ucrt-x86_64-toolchain  整套的编译器和调试器，对应UCRT64子环境
	mingw-w64-x86_64-qt5 QT的开发包，对应MingGW64子环境
pacman -U  xxx.pkg.tar.gz
  安装本地软件包
  包名称支持通配符*，例如：d:/data_pacman/mingw-w64-x86_64-toolchain/*.zst
pacman -Sy
  更新远程仓库的包列表，本质就是下载包列表的数据库文件
pacman -Sl
  显示软件仓库所有软件的列表
pacman -Qs 关键字
  搜索已安装的软件包
pacman -Qi 软件包
  查看某个软件包详细信息
pacman -Ql 软件名
  列出软件包所有文件安装路径
pacman -R[v 详情] 软件名
  卸载软件，不卸载依赖
pacman -Rs 软件名
  卸载软件，同时卸载依赖
pacman -Rsc 软件名
  卸载软件，并卸载依赖该软件的其它程序
pacman -Sg
  列出软件仓库上所有软件包组
pacman -Qg
  列出本地已经安装的软件包组和子软件包
pacman -Sg 软件包组
  查看软件包组所包含的软件包
pacman -Qg 软件包组
  查看软件包组所包含的软件包
pacman -Sc
  清理未安装的软件包文件
pacman -Scc
  清理所有的缓存文件

GTK
gcc `pkg-config --cflags gtk+-2.0` -o main.exe main.c `pkg-config --libs gtk+-2.0`
```
## C语法
```
数据类型
三大分支
结构体
函数
递归

数据结构
链表
队列
栈
树和二叉树

系统编程
基本操作和shell
进程间通信IPC机制
数据编程

数据统访问
socket库
linux/windows下的IPC库
配置文件读写库
日志库


```
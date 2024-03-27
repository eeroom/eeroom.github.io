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
nginx.conf,配置静态站点和文根
http{
	server{
		listen 80;
		server_name www.baidu.com #如果配置，则进行hostname匹配过滤
		location / {
			/root/www/aa/   html; # 程序文件所在的目录
            index  index.html index.htm; # 默认页
		}
		location /mv {
			/root/s1/   html; #浏览器访问/mv/qq.html，则实际访问文件为的/root/www/mv/qq.html
            index  index.html index.htm; # 默认页
		}
	}
}
```
## 编译haveged
```
准备gcc
官网下载tar.gz包，然后解压
切换到压缩包根目录
	执行： ./configure
	执行完configure,就会生成makefile文件，然后就可以执行make
执行：make
执行：make install
	会把主程序和配置文件复制到/usr/local/sbin/ 目录下
启动程序：haveged -w 1024 -v 1 [--Foreground 可选]
执行：make uninstall
	卸载程序
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
pacman -S 包名 [--downloadonly 仅从远程仓库下载到本地目录，不执行安装]
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
pacman -S msys2-keyring
	解决安装程序报错， signature from "David Macek <david.macek.0@gmail.com>" is unknown trust

使用pacman下载依赖包的时候，屏蔽不想要的子环境的包，修改配置文件：/etc/pacman.conf
注释不想要的子环境，例如：
#[mingw32]
#Include = /etc/pacman.d/mirrorlist.mingw

#[ucrt64]
#Include = /etc/pacman.d/mirrorlist.mingw

GTK
gcc `pkg-config --cflags gtk+-2.0` -o main.exe main.c `pkg-config --libs gtk+-2.0`
```
## configure文件
```
configure的参数约定：
--prefix的作用：编译时指定程序后续的安装目录，及配置文件读取目录
如果不指定--prefix的值，则默认值如下：
可执行文件：/usr/local/bin
库文件：/usr/local/lib
配置文件：/usr/local/etc
其他资源文件：/usr/local/share
缺点：搞不清哪些文件属于哪个程序

如果指定:--prefix=/usr/local/abc ,那么这个程序的所有文件都放在abc目录中
删除程序只需要删除abc目录即可
把程序给其他机器用也只需要复制abc目录即可
```
## VsCode配置gcc环境
```
C/C++插件，微软提供，支持跳转到定义，智能提示等功能，默认使用vc编译器和msvc的体系进行智能提示
c_cpp_properties.json C/C++插件的配置文件，完整路径：项目根目录/.vscode/c_cpp_properties.json
	默认情况下没有该文件，可以直接创建 或者 打开命令面板，搜索c++，选择编辑配置(UI/JSON)间接创建
	关键配置项：
	"compilerPath": "编译器完整路径"
	"intelliSenseMode": "智能提示的体系"
	"includePath": ["${workspaceFolder}/**","E:/gtk30/include/**","E:/gtk30/lib/glib-2.0/include",需要include文件的所在目录]
launch.json vscode的调试功能读取此配置文件，完整路径：项目根目录/.vscode/launch.json
	关键配置项：
	"name": "展示在调试的下拉列表"
	"program": "被调试的程序"
	"miDebuggerPath": "调试器完整路径"
	"preLaunchTask": "调试之前的要执行操作，比如编译，对应task.json中的lable，非必需"
tasks.json 完整路径：项目根目录/.vscode/tasks.json
	关键配置项：
	"label": "被launch.json中的preLaunchTask使用"
	"command": "编译器路径，make程序路径，各种自定义操作需要执行的程序"
	"args": [参数数组]
设置mingw-w64的终端
	配置项：
	"terminal.integrated.shell.windows": "msys2_shell.cmd的全路径，或者把msys2的根目录添加到PATH变量",
    "terminal.integrated.shellArgs.windows": ["-mingw64", "-no-start", "-defterm", "-here"] 
	可以配置各个子环境的终端，通过msys2_shell.cmd -help查看子环境对应的参数值
```
## 编译openssl
```
从官网下载源代码：openssl-1.1.1w.tar.gz 
打开mingw64环境，切换到源代码根目录
执行：./Configure mingw64 --prefix=/usr/local/myopenssl
执行：make
执行：make install  
特别的：最后一步，通过日志可以发现，会往C:\Program Files目录中创建SSL目录，提示无权限，失败，这正是需要的，所以不要用管理员权限打开编译环境
打开/usr/local/myopenssl 既可看到编译后的可执行文件，头文件，库文件
头文件和库文件可用于后续的开发引用
```
## 编译zlib
```
从官网下载源代码：zlib-1.2.11.tar.gz
打开mingw64环境，切换到源代码根目录
执行：make -f ./win32/Makefile.gcc
完成后在源代码根目录可以看到生成的库文件和示例程序，通过文件生成时间排序可以看出来
头文件也在源代码根目录
```
## msys2编译nginx
```
官网下载源代码，http://hg.nginx.org/nginx   nginx-1.18.0-RELEASE.zip
解压后查看目录：src\os\win32，需要有相应的头文件就能编译windows版nginx
msys2安装依赖：pcre,pcre-devel,openssl,openssl-devel,zlib,zlib-devel
根据configure的检测结果，修改如下：
auto/lib/pcre/conf
	96行 "$NGX_PLATFORM" != win32 改为 "$NGX_PLATFORM" == win32
	115行 /usr/local/lib 改为/usr/lib ;/usr/local/include 改为 /usr/include
auto/lib/openssl/conf
	54行 "$NGX_PLATFORM" != win32 改为 "$NGX_PLATFORM" == win32
auto/lib/zlib/conf
	45行 "$NGX_PLATFORM" != win32 改为 "$NGX_PLATFORM" == win32
auto/feature
	43行 增加：echo ngx_test:"$ngx_test"
修改思路：
官网的指导文档是把依赖打成静态库依赖，需要编译依赖的源码
经过上述修改后，依赖打成动态库依赖
configure的检测逻辑把$NGX_PLATFORM的值设置为win32,参看auto/configure文件的40行,这个设定不能改，否则头文件的坚持过不了
检测依赖库pcre,openssl,zlib的时候，win32默认只能是指定依赖库的源码路径进行静态编译，所以修改坚持的判断条件为：$NGX_PLATFORM" == win32
msys2的pcre的头文件和库文件分别在/usr/include和usr/lib，而普通linux中在/usr/local/include和/usr/local/lib
检测依赖库的原理是写一个最简单的依赖对应库的main函数，然后调用gcc编译，如果成功，该依赖就没问题

生成Makfile
./auto/configure \
    --prefix=. \
    --conf-path=conf/nginx.conf \
    --pid-path=logs/nginx.pid \
    --http-log-path=logs/access.log \
    --error-log-path=logs/error.log \
    --sbin-path=nginx.exe \
    --http-client-body-temp-path=temp/client_body_temp \
    --http-proxy-temp-path=temp/proxy_temp \
    --http-fastcgi-temp-path=temp/fastcgi_temp \
    --http-scgi-temp-path=temp/scgi_temp \
    --http-uwsgi-temp-pat
执行：make
prefix=. ,使得nginx.exe和conf,logs,temp目录保持在同一级
执行：make install
prefix=. ,上述命令会执行失败，因为复制conf目录的时候源目录和目标目录是相同的
可以使用prefix=mynginx ，执行make install ,得到conf,html等文件夹的默认文件
然后结合prefix=. 编译得到的nginx.exe，最终得到完整的可执行程序和配置
因为依赖库是动态编译，运行时依赖一下dll，需要和nginx.exe放在一起:
msys-pcre-1.dll
msys-crypto-1.1.dll
msys-ssl-1.1.dll
msys-z.dll
msys-2.0.dll

--conf-path=conf/nginx.conf，如果不指定，则默认为/usr/local/nginx/conf/nginx.conf
这种情况下，程序在windows也能跑，只是各项配置路径是固定的并且很奇怪
如果nginx在D盘里的某个目录执行，则需要把配置文件放在d:/usr/local/nginx/conf/nginx.conf，日志的路径也类似
--with-http_ssl_module 支持https，待研究

cmd执行nginx.exe即可可以启动服务，注意点：配置文件中默认端口为80，一般需要修改
nginx -s stop 停止服务，需要新开cmd执行
nginx -s reload 重启
```
## msvc编译nginx
```
下载源代码，参照msys2版本
准备pcre,zlib,openssl的源代码[必选]
pcre-8.45.tar.gz
zlib-1.3.tar.gz
openssl-3.2.0.tar.gz
准备perl,strawberry-perl-5.30.3.1-64bit.zip [可选]
cd到源代码根目录，执行
mkdir objs
mkdir objs/lib
cd objs/lib
tar xzf /d/Code/pcre-8.45.tar.gz
tar xzf /d/Code/zlib-1.3.tar.gz
tar xzf /d/Code/openssl-3.2.0.tar.gz [可选]

./auto/configure \
    --with-cc=cl \
    --prefix=. \
    --conf-path=conf/nginx.conf \
    --pid-path=logs/nginx.pid \
    --http-log-path=logs/access.log \
    --error-log-path=logs/error.log \
    --sbin-path=nginx.exe \
    --http-client-body-temp-path=temp/client_body_temp \
    --http-proxy-temp-path=temp/proxy_temp \
    --http-fastcgi-temp-path=temp/fastcgi_temp \
    --http-scgi-temp-path=temp/scgi_temp \
    --http-uwsgi-temp-path=temp/uwsgi_temp \
    --with-cc-opt=-DFD_SETSIZE=1024 \
    --with-pcre=objs/lib/pcre-8.45 \
    --with-zlib=objs/lib/zlib-1.3

--with-cc=cl 
关键点：cl是msvc的编译器
打开vs2015开发人员命令提示符，执行：nmake
执行完后，即可在objs目录下看到编译出来的可执行文件nginx.exe
后续的操作参照msys2版本
```
## 调用libcurl
```
gcc编译器的3个关键参数：
-I指定头文件的目录，可以多个
-L指定库的目录，可以多个
-l指定库文件，可以多个
gcc编译器会有默认的-I值和-L值，分别为/usr/include和/usr/lib

vscode的.vscode/c_cpp_properties.json文件主要影响代码编辑器的智能提示，需要把libcure涉及的头文件的目录包含进来，否则编辑器中报红
 "includePath": [
	"${workspaceFolder}/**",
	"D:\\Downloads\\curl-8.5.0_3-win64-mingw\\curl-8.5.0_3-win64-mingw\\include\\**"
],
./vscode/tasks.json文件影响编译任务，需要指定-I,-L,-l的值
 "args": [
	"-g",
	"${file}",
	"-o",
	"${fileDirname}\\${fileBasenameNoExtension}.exe",
	"-ID:/Downloads/curl-8.5.0_3-win64-mingw/curl-8.5.0_3-win64-mingw/include",
	"-LD:/Downloads/curl-8.5.0_3-win64-mingw/curl-8.5.0_3-win64-mingw/lib",
	"-lcurl"
    ]
等价于在mingw64中执行：gcc -g app.cpp -o app.exe -ID:/Downloads/curl-8.5.0_3-win64-mingw/curl-8.5.0_3-win64-mingw/include -LD:/Downloads/curl-8.5.0_3-win64-mingw/curl-8.5.0_3-win64-mingw/lib -lcurl

依赖的libcurl的来源：
1、从curl官网下载curl-8.5.0_3-win64-mingw.zip
2、pacman安装libcurl-devel，已知问题：编译出来的程序依赖msys-2.0.dll等大量msys-xxx.dll的库，msys-xxx.dll的文件都在msys2子环境的/usr/bin中，并且执行到curl的地方会报错，原因待研究
3、pacman中缺少mingw-x86_64-libcurl-devel的包

最简代码如下：
#include<curl/curl.h>

int main(){
    curl_global_init(CURL_GLOBAL_ALL);
    CURL* curl=curl_easy_init();
    curl_easy_setopt(curl,CURLOPT_URL,"http://www.baidu.com");
    curl_easy_setopt(curl,CURLOPT_FOLLOWLOCATION,1L);
    CURLcode res= curl_easy_perform(curl);
    return 0;
}
```
## 编译mingw64环境下的libcurl
```
从官网下载源代码：curl-7.86.0.tar.gz
解压后，切换到lib目录，执行：make -f Makefile.m32，即可得到libcurl.dll，可用于调用libcurl的库
已知问题，缺少对https等的支持

切换到src目录，执行：make -f Makefile.m32，即可得到curl.exe
通过curl.exe --version 可以看到缺少对https等大量协议的支持
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
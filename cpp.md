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
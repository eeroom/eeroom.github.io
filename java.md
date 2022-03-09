# java--学习笔记

## hello world
```
假定源文件为hello.java,cmd会话的当前工作目录为d:/j20222/
hello.java文件里面定义了几个class,编译后就会有对应数量的xxx.class文件,编译器会把class的名称作为编译后的class文件的文件名，如果是嵌套class那么，会编译生成对应的 [父class名称]$[子class名称].class
场景一：在工作目录下建立hello.java,代码中不定义package,
    编译hello.java文件,注意点：javac hello.java；命令中必须有.java这个文件后缀
    执行入口类,注意点：java 入口类；命令不要包含.class这个文件后缀
场景二：在工作目录下新建hello.java,代码中定义package为io.github.eeroom.hz,
    编译hello.java文件
    执行入口类会报错,找不到类型
    解决办法:创建package对应的目录结构，把.class文件放到io/github/eeroom/hz/下,
    执行：java io/github/eeroom/hz/[入口类]
    注意点：把cmd会话工作目录切换到io/github/eeroom/hz,执行：java [入口类] 是会报错的，找不到类型
场景三：在工作目录新增子目录结构，io/github/eeroom/hz/，然后创建hello.java,定义package为io.github.eeroom.hz
    编译hello.java，以下2中方式都ok,并且编译后的.class文件都在io/github/eeroom/hz/下
    1、javac io/github/eeroom/hz/hello.java
    2、cmd会话工作目录切换到io/github/eeroom/hz目录，然后执行javac hello.java
    执行：java io/github/eeroom/hz/[入口类]
    注意点：把cmd会话工作目录切换到io/github/eeroom/hz,执行：java [入口类] 是会报错的，找不到类型
总结：执行的时候,被执行的class文件所在的物理路径和其代码中定义的package要一致,
     并且cmd会话的当前工作目录为其package定义结构对应的父级目录
```

##  进制基本数据类型
```
二进制、十进制、16进制互转
转为十进制：
    二进制的abcd等价于十进制的值为：a*2^3+b*2^2+c*2^1+d*2^0=Value
    十进制的abcd等价于十进制的值为：a*10^3+b*10^2+c*10^1+d*10^0=Value
    十六进制的abcd等价于十进制的值为：a*16^3+b*16^2+c*16^1+d*16^0=Value
从十进制转出：
    转为二进制，参照等式a*2^3+b*2^2+c*2^1+d*2^0=Value，问题转换为已知Value,反推a,b,c,d;并且a,b,c,d的取值范围都是[0,1]
        方法：a*2^3+b*2^2+c*2^1+d*2^0===2*(a*2^2+b*2^1+c*2^0)+d===Value，也就是说最低位的d就等于Value除以2的余数。
        对应的：a*2^2+b*2^1+c*2^0=Value'，同理，c就等于Value'除以2的余数
        依次同理下去，即可得到b,a的值
    转为十六进制，参照等式a*16^3+b*16^2+c*16^1+d*16^0=Value，问题转换为已知Value,反推a,b,c,d;并且a,b,c,d的取值范围都是[0,F]
        方法：a*16^3+b*16^2+c*16^1+d*16^0=Value===16*(a*16^2+b*16^1+c*16^0)+d===Value，也就是说最低位的d就等于Value除以16的余数。
        对应的：a*16^2+b*16^1+c*16^0=Value'，同理，c就等于Value'除以16的余数，
        依次同理下去，即可得到b,a的值

1个字节===8位2进制(2的8次方)===2位16进制（16的2次方）,也就是一个字节的数值范围大小是[0x00,0xFF]
java的byte是1个字节，但是最高位是符号位，所以数值范围变为[-0x7F,0x7F]
c#的byte也是1个字节，但是没有符号位，所以数值范围[0x00,0xFF]
```
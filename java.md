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
##  进制和基本数据类型
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
c#的byte也是1个字节，但是没有符号位，所以数值范围[0x00,0xFF],sbyte是有符号的，和java的byte等价
```
## 二进制的负数
```
计算机内存内容都是0或者1，如果把一段字节数据按照有符号的数值来解析,±符号改如何解决呢
统一约定：这一段字节数据最高位是符号位，如果符号位值为1就是负数，否则为正数
这既符合我们直觉，规则又非常简单，类似于10进制数在最高位引入±号
基于这个规则，00 00 01 10 就等价于+6，
那么-6等价的二进制序列是多少呢？10 00 01 10？这非常符合直觉，但是计算机内存中并没有采用这种规则！
原因:对两个整数(正数或者负数或者0)进行加法运算，加法电路让符号位直接参与加法计算，这样加法电路才能足够简单！
     如果加法电路额外考虑符号位，加法电路会变得复杂的多！
回到普通的加法计算(-6+6);如果按照直觉的-6二进制序列
    10 00 01 10
  + 00 00 01 10
    10 00 11 00
这结果就变成了-12，这明显不对，当然问题原因就在于我们让符号位直接参与了运算
结论：'负数二进制序列等价于把其对应正数二进制序列的最高位改成1'这个符合直觉的负数表示规则，不能满足让符号位直接参与运算的期望！
继续回到普通减法计算(0-6);
    00 00 00 00
  - 00 00 01 10
    11 11 10 10
非常激动,11 11 10 10是否就可以作为-6的二进制序列呢？答案是肯定的，而且计算机内存就是采用这种方式！
数学原理及证明待研究。。。
上述规则总结是：负数二进制序列等价于把其对应正数二进制序列求反再加1，就是对应正数的补码！
    6的原序列   00 00 01 10
    反码        11 11 10 01
            +  00 00 00 01
    补码         11 11 10 10

反直觉：对应一个字节的有符号整数，
最大值（127）：01 11 11 11
最小值(-128): 10 00 00 00
1:            00 00 00 01 
-1:           11 11 11 11
表示不了+128，
如果需要计算-128+128，需要2个字节的有符号数，
字节数变多，同等正数值只需要在左边补0，但同等负数值的二进制序列非常不一样了！
```
## 字符和字符集
```
字符集本质上就是字符和二进制序列(代码值)的对应关系集合，如unicode,GBK
字符编码本质上就是规定如何存储字符对应的二进制序列，如果utf-8,utf-16,GBK
所以最直接的字符编码方式就是直接存储字符对应的二进制值的序列，典型案例为GBK
但是有的字符编码方式是首先对二进制序列做处理，然后存储处理过后的二进制序列，典型案例为unicode字符集的utf-8编码

unicode字符集，代码值范围是[0x000000,0x10ffff]，使用3个字节，第1个字节代码平面标识，第2、3个字节是其真正的码值
分为17代码区（代码平面），每个区都可包含0xffff+1（65536）个字符,
代码区00：[0x000000,0x00ffff]
代码区01：[0x010000,0x01ffff]
代码区02：[0x020000,0x02ffff]
依次类推
代码区15：[0x0f0000,0x0fffff]
代码区16：[0x100000,0x10ffff]

todo gbk字符集

编码：把字符串和字符转成二进制数据进行存储或传输，需要指定具体的字符编码来确定如何存放每个字符的代码值
以utf-8为例,utf-8是根据每个字符代码值大小所在的区间范围决定使用多少字节来存储该代码值，各个区间范围下，都会在固定的位上填充固定值
    说明：?表示实际的unicode代码值存放位，其它的0、1表示utf-8规范规定的固定位固定值
    区间1：[0x000000,0x00007f] 1字节 0???????
    区间2：[0x000080,0x0007ff] 2字节  110????? 10??????
    区间3：[0x000800,0x00ffff] 3字节  1110???? 10?????? 10??????
    区间4：[0x010000,0x1fffff] 4字节  11110??? 10?????? 10?????? 10??????
    区间5：[0x200000,0x3fffff] 5字节  111110?? 10?????? 10?????? 10?????? 10??????
    区间6：[0x400000,0x7fffff] 6字节  1111110? 10?????? 10?????? 10?????? 10?????? 10??????
因为unicode规范的代码值只在范围[0x000000,0x10ffff]，也就是最高到对应到utf-8的区间4，所以我们说utf-8使用1到4个字节存储字符
比如字符'我'，unicode代码值为：0x6211,那么落在区间3,
0x6211对应的二进制值为：01100010 00010001
把0x6211的二进制值落到1110???? 10?????? 10??????上就变为：[1110]0110 [10]001000 [10]010001
落的规则：01100010 00010001从低位开始依次替换1110???? 10?????? 10??????中对应的?
验证：把[1110]0110 [10]001000 [10]010001 复制到windows的计算器二进制，再切换到十六进制可看到是E6 88 91
     在editpluas中输入'我'，按utf-8保存,然后编辑》16进制查看，也可以看到E6 88 91
乱码案例：中文'联通'按GBK字符集保存后字节数据刚好是110????? 10?????? 110????? 10??????结构，对应utf-8区间2。
重新用记事本、notepad++、editeplus等工具打开后它们会认为这是utf-8编码的文件，然后就乱码，改成按ANSI(windows上表示系统默认字符集，中文就是GBK)。

解码：解析字符串、字符的二进制数据的时候，需要指定具体的字符编码来确定字节数据对应的字符
以utf-8为例，解码的时候，首先逐字节读取。
    把读取到的该字节的值和utf-8区间去匹配，即可知道当前这个字符占了N（[1,4]）个字节，
    然后就可以把这N个字节都读取出来，然后把固定位固定值移除掉，剩下值的就是unicode代码值
    移除utf-8编码中的固定位置的固定值对应的位
    合并剩余的位成为一个或多个字节的值，合并规则和上面落规则互为逆操作
    继续从N个字节后开始逐字节读取

java代码源文件的编码格式可以是utf-8，gbk等，java编译器都可以识别
但是：如果javac运行时使用GBK编码解析文件内容，utf-8编码格式的.java文件包含中文就会编译报错，'编码GBK不可以映射的字符'
同理,如果javac运行时使用utf-8编码解析文件内容，gbk编码格式的源代码文件包含中文就会编译报错
cmd启动javac不加字符编码参数，那么javac就使用GBK编码解析文件内容，因为中文系统默认就是GBK编码
IDEA启动编译时会给javac加utf-8字符集参数，所以idea默认的文件编码格式是utf-8
javac -encoding utf-8 xxx.java

不论代码源文件是何种编码格式，编译后，源代码中的字符和字符串都被被转成utf-8编码后的二进制序列储到.class文件中
tips:可以写最2个简单的java文件，一个包含中文字符，一个包含数字字符，
    编译成.class文件后，以16进制查看.class文件，通过比对找到差异点，就可以发现中文字符、数字字符都是对应utf-8编码后的二进制序列

char类型占用2个字节，每个char实例的整数值对应unicode规范中该字符的代码值(特别：不包含代码区标识位后的代码值)
```
### ![效果图](./img/unicode代码平面.png)
### ![效果图](./img/unicode代码平面-BMP.png)

### 发布jar包到maven中心仓
```
注册sonatype账号，然后提第一次发jar包的issue到sonatype，按照指导完成后，sonatype会开通一个仓库给我们。
我的jar先发到sonatype仓，然后被同步到maven中心仓
项目的pom.xml引入sonatype和gpg相关的插件,参看sln项目的pom.xml和nalu项目的pom.xml
在maven的配置文件setting.xml中配置sonatype的账号和密码，如下图
```
![如图](./img/sonatype的账号配置.png)
```
需要把我们用来发布jar包的公钥发布到sonatype指定的公钥服务器，参看sonatype文档就好
gpg插件用私钥对jar包进行签名的时候，默认会使用gpg密钥列表里的第一对密钥，可以通过增加配置，指定特定的密钥对，如下图
```
![如图](./img/gpg配置01.png)
![如图](./img/gpg配置02.png)
```
gpg教程
生成密钥对：gpg --genkey
查看已有的密钥列表：gpg --list-keys
每个密钥对信息的第二行那一串guid值就是keyid
导出公钥：gpg -o 公钥导出后的保存的文件  --export key的id  -a
导出私钥：gpg -o 私钥导出后的保存的文件  --export-secret-keys key的id  -a
导出私钥的时候会跳出对话让我们输入私钥的密码！
导出约定：-a是可选的，标识是否使用ascii armor，不论公钥还是私钥，如果指定这个参数，导出的保存文件就用.asc结尾，如果不指定就用.gpg结尾
小技巧：如果加了-a参数，导出的文件可以直接以普通文本查看
导入公钥：gpg --import 公钥导出后的保存的文件
导入私钥：gpg --import 私钥导出后的保存的文件
完整教程请查看pdf文件
```
gpg完整教程文档[FAQ:](./pdf/gpg教程.pdf)
## ObjectMapper序列化匿名对象
```
var mapper=new com.fasterxml.jackson.databind.ObjectMapper()
mapper.setVisibility(PropertyAccesser.ALL,JsonAutoDetect.Visibility.ANY);
mapper.writeValueAsString(new Object(){int id=1;String name="zz";});
```
## 笔记
```
java虚拟机=java解释器+jit即时编译
1996年  java1.0   应用场景:浏览器上java applet，类型于silverligth,flash，后期直接被禁用
1997    java1.1     内部类
1998     java1.2    strictfp修饰符
            java1.3
            java1.4(java sdk)    特性：断言，应用场景：服务端应用，生成html页面
2004    java5.0         特性：泛型，元数据，枚举，foreach循环，自动装箱，注解
            java6      增强类库
2009    oracle收购sun
2011     java7(jdk1.7)        简单改进
2014     java8（jdk1.8）         特性：lambda，流和日期时间库 
2017      java9       特性：模块化，版本号混乱终结了，java版本号和内部版本号维持一致，oracle jdk不再包含32和64位的jdk，仅包含64位jdk。openjdk的版本待研究
2018           每6个月一个大版本

JShell，jdk包含一个jshell的可执行文件，和java可执行文件在相同目录

xxx.java->xxx.class
源代码->字节码
源码的文件名必须和文件内的公共类名称保持一致

8中基本类型，primitive type
byte    1字节   [-128,127]
short   2字节   [-32786,32767]
int     4字节   [-20亿,20亿]
long    8字节   []
float   4字节   有效位数6到7位，所以非常接近0的值（小数点后面大于7个0），float会直接保存为0
double  8字节   有效位数15
char    2字节 
boolean 1字节  

三个特殊的浮点数，正无穷，负无穷，NaN
算术二元运算，首先会把两个数据的数据类型转成一致，然后再进行计算
如果除数是0，则异常
如果除数是0d或者0f，结果是NaN或者无穷
0d/0d=NaN
0f/0f=NaN
NaN==NaN的结果是false，js的浮点数也类似
判断一个值是否是NaN的正确做法：Double.isNaN(值)

'A'的Unicode码点是65，等价写法'\u0041'
常用的转义
\b  退格  \u0008
\t  制表  \u0009
\r  回车  \u000d
\n  换行  \u000a
\"  "     \u0022
\'  '     \u0027
\\  \     \u005c
\u  16进制表示字符
    [     \u005B
    ]     \u005D

转义会在代码解析之前处理，类似于宏的预处理，"\u0022+\u0022" 编译前被转为""+""，运行时的结果为""
public static void main(String\u005B\u005D args) 可以编译通过，ide会报红
注释里面如果出现\u，就可能产生编译报错，ide不会报红，// \u000a is a new line ，\u000a是换行符，导致编译报错
\u后边必须接4个16进制数，否则报错，在注释中也存在这个情况

1991年       Unicode1.0
Unicode字符超过35536个，16位char类型以及不能满足描述所有Unicode字符
Unicode码点分为17个代码平面

java采用16位Unicode字符集
UTF-16编码采用不同长度的编码表示所有的Unicode码点，在第一个基本多语言平面，每个字符用16位表示，通常称为代码单元，char类型描述了UTF-16编码中的一个代码单元
UTF-8编码采用不同长度的编码表示所有的Unicode码点，在第一个基本多语言平面，0-127用8位表示，整体的思路和UTF-16类似，就是字节本身的大小决定了其是属于那一类（8位表示的值，16位表示的值，24位表示的值）,UTF-8非常适合网页，html中的标签,以及js代码都是在[0-127]范围内，如果用UTF-16，体积翻倍

变量，常量就是值不变的变量
Character.isJavaIdentifierStart()
Character.isJavaIdentifierPart()
可以判断某个字符是否可以作为变量的开头或者其他部分
变量必须被赋值后才可以被使用，否则编译报错，
c#中区分值类型和引用类型，java没有这个划分

StringBuilder 和c#的StringBuilder是等价的，优先使用，java5引入
StringBuffer，是StringBuilder的前身，和 StringBuilder 的区别，允许多线程进行添加和删除，两者的api是一致的

输入和输出
System.out.println()
var scanner=new Scanner(System.in)
var value=scanner.nextLine()
和c#的System.Console.WriteLine()和System.Console.ReadLine()类似
var console=System.console();
var value= console.readLine("请输入用户名:");
var pwd=console.readPassword("请输入密码:");
console.printf(new String(pwd));
和c#的System.Console.WriteLine()和System.Console.ReadLine()类似
特别的，在idea直接运行console是null，由cmd启动则正常，readPassword可以隐藏输入的字符

格式化输出
String msg=String.format("姓名：%2$s，年龄：%1$d，%1$d",121,"张三");
System.out.println("姓名：%2$s，年龄：%1$d，%1$d",121,"张三")
%[索引值$][,(5.2f 转换浮点数][d 转换整数][s 转换字符串][c 转换日期时间]
特别的，索引值从1开始

简单读取和写入文本文件
var scanner=new Scanner(Path.of("D:\\vs2019启动没反应.txt"),"GBK");
try (var printWriter=new java.io.PrintWriter(new File("D:\\vs2019启动没反应UTF-8.txt"),"UTF-8")){
    while (scanner.hasNext()){
        printWriter.println(scanner.nextLine());
    }
}

大数
java.math.BigInteger，可以处理任意序列长度的整数
java.math.BigDecimal，可以处理任意精度的浮点数
java.math.BigInteger.valueOf(100)，不能使用算术运算符，需要调用相应的方法
java仅重载的了字符串的+运算符，并且不允许重载运算符

数组
int[] lst=new int[5];
int[] lst2={1,2,3,4};
int[] lst2=new int[]{1,2,3,4};
c#初始化数组语句：int[] lst3=new int[]{1,2,3,4};
数组内容的字符串：var str=java.util.Arrays.toString(lst2)
int[][] lst2={{1,2,3,4},{1,2,3,4}};
var ars= java.util.Arrays.deepToString(lst2);
sort 快排
copyOf 拷贝
binarySearch 二分查找算法查找指定值，返回索引
fill 填充指定值
equals 如果长度相同，并且相同索引的元素也相等，则两个数组相等
java实际没有多维数组，只有一维数组，多维数组被解释"数组的数组"

对象和类
面向过程编程，先考虑算法，再考虑数据结构，算法+数据结构=程序
面向对象编程，先考虑数据结构，再考虑算法，数据结构+算法=程序
类：构造对象的模板
对象：类的实例
封装：数据和行为组合，编译后，数据和行为分离，访问器方法如果返回一个可变对象引用，意味着破坏封装性，可以返回改字段的clone对象，避免破坏封装
继承：
多态：
对象的三个主要特征：行为，状态，标识
类之间的关系：依赖，聚合，继承
对象变量等价于c++的一级指针，和c++的引用不一样

java的java.util.Date类实例表示一个特定的时间点，本质是距离UTC1970年1月1日00:00:00的毫秒数
UTC 国际协调时间
GMT 格林尼治时间
java.time.LocalDate对应日历表示法表示的日期，1.8新增的
java.time.LocalDate.now()
java.time.LocalDate.of(2022,12,22)

参数校验，对于null值得便捷处理
Objects.requireNonNull(args,"必须指定args的值")
Objects.requireNonNullElse(args,new String[]{"abc"})

final修饰常量或者变量，等价于c#的readonly
静态字段又称为类字段
静态常量：public static final double PI=3.1415
等价于c#:public static readonly double PI=3.1415
或者：public const double PI=3.1415
c#中const修改的变量等价于static+readonly，java中const是保留关键字，目前未使用

调用静态方法的两种方式：
类名称.静态方法()
实例.静态方法()
c#中调用静态方法的两种方式：
类名称.静态方法()

术语"静态"的历史，C引入static为了表示退出一个块后依然存在的局部变量。在这种情况下，术语"静态"是有意义的：变量一直保留，当再次进入这个块时仍然存在。
随后，static在C中有了第二种含义，表示不能从其他文件访问的全局变量和函数，为了避免引入新的关键字，所以重用了关键字static
最后，C++第三次重用了这个关键字，与前面赋予的含义完全无关，它指示属于类而不属于实例的变量和函数
java的static与c++中等价

方法参数
参数传递给方法的方式：按值调用（传递变量的值，java中引用类型的变量本身就是一个一级指针，如果按引用传递，就变为二级指针），按引用调用（等价于传递变量的指针），按名调用
java总是采用按值调用
c#默认总是按值调用，如果参数使用ref或者out修饰，则变为按引用传递

字段和构造函数
方法中的变量必须明确赋值后才可以使用，否则编译报错
实例字段可以不明确复制，因为如果构造函数没用显式地为字段赋值，编译器会自动地赋上默认值，值类型为0，布尔类型为false，对象引用为null
上述规则，java和c#是一致的

包
java允许使用包将类组织在一个集合中，借助包可以方便的组织自己的代码，并将自己的代码和别人提供的代码库分开管理
使用包的主要原因是确保类名的唯一性，假如两个程序员都建立了Empoloyee类，只要将这些放在不同的包中，就不会产生冲突
为了保证包名的绝对唯一性，要用一个英特网域名（这显然是唯一的）以逆序的形式作为包名，然后对于不同的工程使用不同的子包
包名+类名=类的完全限定名
从编译器的角度看，嵌套的包名之间没有任何关系，例如java.util包和java.util.jar包毫无关系，每个包都是独立的类集合
c#中的等价概念是命名空间，如果命名空间仍然冲突，可以为不同程序集指定别名，然后利用别名来体现类的完全限定名

想要把类放入包中，就必须将包的名字放在源文件的开头，将源文件放到与完整包名匹配的子目录中，编译器将编译后的类文件也放在相同的目录中
如果没有在源文件中放置package语句，这个源文件中的类就属于无名包，无名包没有包名
特别的：编译器在编译源文件的时候不检查目录结构，如果代码中声明的包名和实际的目录结构不一致，并且它也不依赖其他的包，就可以编译成功
  但是，最终程序将无法运行，除非先将类文件移到代码声明的包名对应的路径中，否则，虚拟机就找不到类
总结：类路径必须与包名匹配，这是jdk的约定，从1.2版开始，jdk的实现者修改了类加载器，明确禁止加载包名以java.开头的用户自定义的类

类文件也可以存储在JAR文件中，java归档。

继承
超类<-子类
基类<-派生类
父类<-子类
调用超类构造函数和超类的普通方法
public class Student extends People{
    string name;
    public Student(){
        super(101);
        this.name=super.getTag()+"|Student";
    }
}
c#调用父类构造函数
public class Student:People{
    string name;
    public Student():base(101) {
        this.name=base.getTag()+"|Student";
    }
}
所有类默认可以被集成，使用final修饰符，则类不能被继承，并且他的所有方法都被final修饰
c#中所有类默认可以被集成，使用seal修饰符，则类不能被继承

强制类型转换
只能在继承层次内进行强制类型转换
判断变量是否指向某个类型或其子类型的实例：obj instanceof 类型
c#的等价操作:obj is 类型

方法访问控制修饰符
仅本类可见           private
仅对本包可见         默认，没有修饰符
仅对本包和子类可见   protected
所有可见            public

C#方法的访问控制修饰符
仅本类可见             private
仅所在程序集可见       internal
仅子类可见             protected
仅子类和当前程序集可见  protected internal
所有可见              public

多态
所有方法默认可以重写，使用final修饰符，则方法不允许被重写，final类的所有实例方法都被final修饰
c#所有方法默认不可以重写，使用virtual修饰符，则方法允许被重写
c++所有方法默认不可以重写，使用virtual修饰符，则方法允许被重写

协变和逆变
子类1[] a=value;
超类[] b=a;         编译通过，运行通过
潜在的问题：
b[0]=子类2实例      编译通过，运行通过
a[0].子类1的方法()  编译通过，运行报错或者结果非预期
数组存在这个问题，普通变量也可能存在这个问题，因为赋值操作：
子类1 a=子类2的实例               编译不通过
子类1 a=(子类1)((超类)子类2实例)  编译通过，运行报错  

方法调用：静态绑定，final修饰的方法，编译器都可以实现静态绑定，
动态绑定，非final方法需要虚拟机进行动态绑定，虚拟机在程序启动后会维护一份方法列表，可以根据方法签名快速匹配
对于静态绑定，编译器可能对方法调用进行优化，内联，等价于把被调用方法的内容搬到调用的地方，避免一次方法调用
对于动态绑定，虚拟机会进一步进行内联优化

对象包装器和自动装箱
所有基本类型都有与之对应的类，通常，这些类称为包装器，包装器类是不可变的，并且都是final类
泛型的类型参数不能是基本类型，
自动装箱规范要求boolean,byte,char<=127,short[-128,127],int[-128,127]被包装到固定的对象中
Integer a=127;
Integer b=127;
则a==b总是成立的，因为包装到固定对象中，所以指向的地址是一样的
范围之外的包装器值，使用equesl方法比较值是否相等
拆箱和装箱在编译阶段完成，编译器在生成类的字节码时会插入必要的方法调用，虚拟机只是执行这些字节码

可变长参数方法
int max(String name,int... lst){
}
等价于
int max(String name,int[] lst){
}
特别的：可变长参数最多只能有一个，而且是最后一个参数，可以直接把数组传给可变长参数
max(1,2,3)编译器会转换为：max(new int[]{1,2,3})
c#的可变长参数
int Max(string name,params int[] lst){
}

枚举
枚举的构造器总是私有的，可以省略private修饰符
public enum Size{
    大(1),中(2),小(3);
    private Size(int value){
      this.value=value
    }
    int value;
}
枚举的toString方法返回枚举常量名，和valueOf互为逆方法，

反射
Class类，获取Class类实例的3中方法：
实例.getClass()
类型.class
Class.from('类的完全限定名')
 
获取类、字段、方法的修饰符信息
java.lang.reflect.Modifier.isFinal(T.class.getModifiers())
java.lang.reflect.Modifier.isStatic(T.class.getDeclaredField("").getModifiers())
java.lang.reflect.Modifier.isPublic(T.class.getDeclaredMethod("").getModifiers())

T.class.getFields()
  返回类支持的公共字段，包括超类的公共字段
T.class.getDeclareFields()
  返回类中的全部字段，包括私有、受保护的，不包括超类中的字段
方法和构造器也都有对应的两套
反射机制的默认行为受限于java的访问控制，对应于他的访问修饰符，可以调用Field,Method,Constructor对象的setAccessible方法覆盖java的访问控制
setAccessible方法是AccessibleObject类中的一个方法，它是Field,Method,Constructor类的超类，这个特性是为调试，持久存储和类似机制提供的
setAccessible方法可能会抛异常，原因是访问被模块系统或者安全管理器拒绝

java.lang.reflect.Array
java.lang.reflect.Array.newInstance(int.class,100)
  利用反射，创建指定元素类型和长度的数组
java.lang.reflect.Array.getLength(lst
)
  利用反射获取数组的长度
int[].class.getComponentType()
  获取数组元素的类型，专用方法
特别的：int[]可以转为Object类型，但是不能转为Object[]类型
       People[]可以转为Object类型，也能转为Object[]类型

接口、lambda表达式和内部类
接口中所有方法都自动是public方法，在接口中声明方法的时候，不必提供关键字public
Comparable接口约定，int (T other)
返回0，则this==other
返回>0，则this>other
返回<0，则this<other
返回的时候避免int溢出，导致本来是>0的，最终却是<0，也可以使用Integer.compare()，避免算术减法操作的结果溢出
浮点数进行比较的时候，可以使用Double.compare(v1,v2)这个静态方法，因为如果两个值非常接近，算术减法操作的结果可能是0，从而不符合预期

```
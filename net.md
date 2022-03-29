# net--学习笔记
## 整数-字符-二进制序列-十六进制序列
```
解析整数的规则：有符号的数，最高为符号位，最高位为0表示正数，最高位为1表示负数，无符号的数，不考虑符号位
把正数按有符号数转二进制序列的时候，最高位一定是0，体现在序列字符串上，高位前导的0都省略掉了
把负数按有符号数转二进制序列的时候，最高位一定是1
规律：对于一个负数，增加位数来表示等价的值，把所有增加的高位补1
     对于一个正数，增加位数来表示等价的值，把所有增加的高位补0
```
![效果图](./整数-字符-字节数组(整数数组)-字符串-二进制序列-十六进制序列.png)

## byte和sbyte互转
```
c#:byte为无符号整数，范围：[0-255][00-FF]，sbyte为有符号整数，范围[-128,127][80,7F]

java:byte为有符号整数，等价于c#的sbyte，java没有提供无符号的byte类型
已知无符号的byte值bv[0-255],获取其二进制序列对应的有符号的值：byte sbv=(byte) ((int)bv)
已知有符号的byte值sbv[-128,127],获取其二进制序列对应的无符号的值：
1、int bv= ((int) sbv) & 0xff;
2、int bv= Byte.toUnsignedInt(bv)
0xff就是0x000000ff，进行&运算，导致另一个计算数的高6位全部变为0,只剩下原有最低的2位保持原序列值。
((int) sbv) & 0xff的原理等价于下面的代码：
byte sbv=-3;
var str= Integer.toHexString(sbv);
var bv2=Integer.parseInt(str.replace("ffffff","000000"),16);
```

## JwtToken互通
```
JWTToken，c#和java的com.auth0>java-jwt类库兼容
输入：hearder(字典)，payload（字典），key(哈希算法的密钥)
header={{alg:HS256},type:JWT}
alg根据业务需要，后续算signCode做相应的调整
payload中的数据根据业务需要

java中的时间,Calendar.getInstance().getTime()等价于
(DateTime.Now.ToUniversalTime()-new DateTime(1970,1,1)).TotalSeconds

序列化header,然后转base64，然后做额外处理得到headerCode，
额外处理逻辑：baser64str.Split('=')[0].Replace('+','-').Replace('/','_')
序列化payload，然后转base64，然后额外处理，逻辑同上,得到payloadCode
使用HMACSHA256哈希算法，
算法的Key=key按UTF8取字节数组
buffer=算法.ComputeHash(UTF8取字节数组(headerCode+"."+payloadCode))
把buffer直接转base64，然后额外处理，逻辑同上，得到signCode
最后的jwttoken=string.Join(".",headerCode,payloadCode,signCode)
```

## 分布式和集群
```
现对于单机系统(应用程序,数据库等等都在一台服务器)而言,
一件具体的事情由多台不同的服务器共同完成，服务器之间存在协同；或者多台服务器可以无差别的处理同一件具体事情
依据看待事情的角度来确定怎样算一件具体的事情
用户修改密码，站在产品的功能点来看，可以看成一件事情，涉及应用程序，数据库，
站在代码处理流程的角度，也可以看成两件事情，1、http服务接收用户请求，2、数据库执行sql
对应的，把http接受用户请求搞成多台部署，就成了应用程序集群
把数据库部署多台,就成了数据库集群
所以集群一定是分布式部署，是一种特点情况下的分布式
```

## T-SQL和SSMS(sqlserver management studio)
```
声明变量：declare @名称 类型
声明临时表：declare @表名称 table(列名称 类型，列名称 类型，...)

insert 语句，表必须存在
insert into 表 values()
insert into 表 select语句
insert into 表(列名称，...) values()
insert into 表(列名称，...) select语句

insert 语句，表必须不存在（#表名称 为临时表，会话结束自动删除，否则为非临时表）
select 列
into 表
from ....

update 语句，批量更新
update 表 别名1
join 表2 别名2 on 连接条件
set 别名1.列=别名2.列
where ....

delete 语句，批量删除

集合操作
取差集：except 
取并集：union
取交集：intersect

output 语句
insert into 表（列） output inserted.列名 values()
update 表 set 列1=值 output inserted.列名 where ...

表分区
第一步：添加文件组和文件
创建分区函数：create partition function 名称（分区字段类型） as range right for values(区间值1,区间值2,,,)
创建分区scheme:create partition scheme 名称 as partition 分区函数名称 to(文件组1,文件组2,,,)
tips:文件组个数=区间值个数+1，因为5个区间值对应6个区间段，需要对应6个文件组，,不同的分区可以使用相同的文件组
创建分区表：create table 表名称（列1名称 类型，列2名称 类型,...）on 分区scheme(分区字段)
创建索引：也使用相同的 on 分区scheme(分区字段)

查询具体的数据会落在哪个分区：select $partition.分区函数名 ('具体数据对应分区列的值，比如："2020-06-04"')
返回值是分区序号，从1开始
查询指定分区序号下的所有记录：select * from 表名 where $partition.分区函数(分区列)=分区序号

删除1年以前的定分区数据
创建临时表，结构和源表一样，使用相同的 on 分区scheme(分区字段)
确定要删除的分区的序号，分区序号从1开始，计算序号的逻辑，借助临时表，键值结构（月份，序号）
切换别删除分区的数据到临时表：alter table 源表 switch partition 分区序号 to 临时表 partition 分区序号
删除临时表：drop table 临时表

水平分区，表结构不变，数据落在不同的文件
优点：文件可以落在不同的磁盘，按照分区条件查数据的时候性能大大提高
		极大的方便不停机归档数据，如果不分区进行归档数据，有两个土办法（往归档表写，往原表删；或者：原本重命名，新建原表，往原表回写）

利用临时表记录数据的变化情况（有时候权限所限，不能触发器，没有建表权限，只能临时表。触发器和非临时表更科学）
思路：利用循环语句,定时查询某个需要监视的数据行，然后把当前值写入记录表中，额外包含写入时的时间，后续按照写入时间排序，就能看出数据是如何变化的！
创建临时表：
create table #表明称(列1 列1的类型,列2 列2的类型,......,写入时间 datetime)
循环查某个数据写入临时表,每5秒查一次:
while 1=1
begin
	WAITFOR DELAY '00:00:5'
	insert into #表名称(列1,列2,...,写入时间)
	select 列a,列b,...,getdate()
	form ...
	where ....
end

指定事务隔离级别：SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
级别有：READ UNCOMMITTED;READ COMMITTED

事务、事务隔离级别、锁的区别和关系，update锁，insert锁

SSMS中设置隐式事务：SET IMPLICIT_TRANSACTIONS ON
SSMS移除缓存的账号和密码，本质就是删除一个对应的缓存文件，
这些账号和密码并没有写到注册表中，而是在缓存文件
缓存文件路径：当前用户目录》AppData》Roaming》Microsoft》SQL Server Management Studio》SSMS版本》SqlStudio.bin
```


## ef数据迁移
```
启用迁移：Enable-Migrations
增加一个版本：Add-Migration 版本名称
更新到最新版本：Update-Database -Verbose
更新到指定版本（支持回退版本）:Update-Database –TargetMigration:版本名称
获取从A版本更新到B版本对应的sql脚本：Update-Database -Script -SourceMigration:版本A -TargetMigration:版本B
宏变量，0版本名称：$InitialDatabase
```
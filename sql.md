## ssms
```
sqlserver management studio
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
  指定事务隔离级别
  隔离级别主要有：READ UNCOMMITTED、READ COMMITTED
事务、事务隔离级别、锁的区别和关系，update锁，insert锁
  待研究
SET IMPLICIT_TRANSACTIONS ON
  设置隐式事务
清理登陆界面缓存的账号和密码，步骤如下：
  缓存的账号和密码被保存在特定目录的文件中，路径：%当前用户目录%\AppData\Roaming\Microsoft\SQL Server Management Studio\%版本%\
  删除文件：SqlStudio.bin
```
## sqlserver
```
https://juejin.cn/post/7231070518223962172
声明变量
     declare @变量名称 类型
变量赋值
     set @变量名=变量值
     select @变量名=count(1) from 表
     select @变量名=列名称 from 表
       特别的：如果有多行，则变量的值是最后一行对应的值
声明临时表
     declare @表名称 table(列名称 类型，列名称 类型，...)
插入语句（表必须存在）
     insert into 表(列名称，...) values()
     insert into 表 values()
     insert into 表(列名称，...) select语句
     insert into 表 select语句
插入语句（表必须不存在）
     select 列
     into 表名
     from ....
       特别的：表名以#开头， 为临时表，会话结束后自动删除，否则为非临时表
更新语句（连表）
     update 表 别名1
     join 表2 别名2 on 连接条件
     set 别名1.列=别名2.列
     where ....
删除语句（连表）
     delete 别名1 
     from 表1 别名1
     join 表2 别名2 on 连接条件
     where 筛选条件
output语句
     insert into 表(列) output inserted.列名 values()
     update 表 set 列1=值 output inserted.列名 where ...
分支语句
     if (@变量=3)
          begin
          ...
          end
     else
          begin
          ...
          end
循环语句
     while @变量=3
          begin
          ...
          end
序列
     create SEQUENCE 序列名称 AS 类型    START WITH 初始值    INCREMENT BY 步长    [CYCLE]
     drop SEQUENCE 序列名称
       特别的：需sqlserver2014及以后的版本才支持
集合操作
     取差集：except 
     取并集：union
     取交集：intersect
调试
     存储过程和触发器可以在ssms中直接进行调试
     打开存储过程和触发器的代码，对应的修改或者创建语句都可以，打上断点
     新建一个查询窗口，编写调用存储过程的语句或者编写增删改的语句，打上断点，从菜单栏中的调试菜单启动调试，F11即可进入逐行调试
触发器
     触发器的代码执行的时候，总是发生在增删改完成以后
     触发器或者存储过程代码中查询触发器所在表的时候一定要考虑到上述情况
文件组
     ALTER DATABASE 数据库 ADD FILEGROUP 文件组名称
表分区的操作步骤：
  添加文件组和文件
  创建分区函数：create partition function 名称(分区字段类型) as range right for values(区间值1,区间值2,,,)
  创建分区scheme:create partition scheme 名称 as partition 分区函数名称 to(文件组1,文件组2,,,)
  tips:文件组个数=区间值个数+1，因为5个区间值对应6个区间段，需要对应6个文件组，,不同的分区可以使用相同的文件组
  创建分区表：create table 表名称(列1名称 类型，列2名称 类型,...)on 分区scheme(分区字段)
  创建聚集索引[且唯一索引]：create [unique] clustered index 索引名称 on 表名称(列名称 ASC或DESC [,列名称2 ASC或DESC]) ON 分区scheme(分区字段)
  创建非聚集索引[且唯一索引]：create [unique] nonclustered index 索引名称 on 表名称(列名称 ASC或DESC [,列名称2 ASC或DESC]) ON 分区scheme(分区字段)
  特别地：如果是唯一索引，则索引列中一定要包含分区列！
  设定主键本质就是创建唯一聚集索引，所以分区表如果创建主键，则一定要包含分区列
分区表查询
  查询具体的数据会落在哪个分区：select $partition.分区函数名 ('具体数据对应分区列的值，比如："2020-06-04"')
  返回值是分区序号，从1开始
  查询指定分区序号下的所有记录：select * from 表名 where $partition.分区函数(分区列)=分区序号
分区表清理的操作步骤
  创建临时表，结构和源表一样，使用相同的 on 分区scheme(分区字段)
  确定要删除的分区的序号，分区序号从1开始，计算序号的逻辑，借助临时表，键值结构(月份，序号)
  切换别删除分区的数据到临时表：alter table 源表 switch partition 分区序号 to 临时表 partition 分区序号
  删除临时表：drop table 临时表
  释放磁盘空间
分区表清理的场景
  某个数据文件可能有一个或多个分区的数据落在这个文件上，但是这些分区的数据业务上已经没有意义
  需要清理分区数据，加快查询速度
  需要释放磁盘空间，降低磁盘占用
  清理分区数据后，分区对应的数据文件仍然存在，文件大小不会改变
  删除分区表对应的临时表后，临时表的数据文件仍然存在，文件大小不会改变
释放磁盘空间的操作步骤：
  确保数据文件对应的分区已经被清理
  确保数据文件所在的分组在释放后还至少有一个文件，如果该数据文件是所在文件组中的唯一文件，需要提前添加一个新文件到所在文件组
  执行收缩：DBCC SHRINKFILE([文件名称],EMPTYFILE)，
    即使文件很大，T级别，收缩也很快，收缩成功后，文件大小并不会改变，也就是不会释放磁盘空间
  执行删除数据文件：ALTER DATABASE [数据库] REMOVE FILE [文件名称]
    文件删除后，才真正的释放了磁盘空间
水平分区
  表结构不变，数据落在不同的文件
  优点：
  文件可以落在不同的磁盘，按照分区条件查数据的时候性能大大提高
  极大的方便不停机归档数据，如果不分区进行归档数据，有两个土办法(往归档表写，往原表删；或者：原本重命名，新建原表，往原表回写)
数据监测（循环语句和临时表实现）
  场景：分析生产环境bug，只有查询权限，不能创建触发器，不能创建建表。
  bug：分布式系统中，程序员预期按照步骤T1,T2,T3的顺序修改某个字段，代码的逻辑判断依赖该字段值，实际情况出现了步骤T1,T3,T2的更新顺序，导致bug
  目的：得到某个字段值的变化情况
  实现方法：创建临时表,循环语句,定时查询需要监视的数据字段，把查询结果和当前时间（作为写入时间）添加到临时表中，按照写入时间排序就是字段的变化过程
  create table #表名称(列1 列1的类型,列2 列2的类型,......,写入时间 datetime)
  while 1=1
  begin
     --等待500毫秒，小时:分钟:秒:毫秒
  	WAITFOR DELAY '00:00:00:500'
  	insert into #表名称(列1,列2,...,写入时间)
  	select 列a,列b,...,getdate()
  	form ...
  	where ....
  end
切割字符串（split函数）
  CREATE FUNCTION splitToString
  (
  	@str nvarchar(1000),
  	@splitstr nvarchar(10)
  )
  RETURNS @returntable TABLE
  (
  	v1 nvarchar(100)
  )
  AS
  BEGIN
  	DECLARE @xmlstr XML;
      SET @xmlstr = CONVERT(XML, '<root><a>' + REPLACE(@str, @splitstr, '</a><a>') + '</a></root>');
      INSERT INTO @returntable
      SELECT F1 = N.a.value('.', 'varchar(100)') 
  	FROM @xmlstr.nodes('/root/a') N(a);
  	RETURN;
  END
切割字符串（使用示例）
     select *
     from INFORMATION_SCHEMA.COLUMNS cc
     join splitToString('1,3,4,5,6,aa',',') t2 on t2.v1=cc.COLLATION_NAME
数据库已执行的sql语句的历史纪录（查询系统表）
  select eqs.creation_time as 首次次执行时间,eqs.last_execution_time 末次执行时间,eqs.execution_count 总次数,eqt.text sql语句,eqt.*,eqs.*
  FROM  sys.dm_exec_query_stats eqs CROSS APPLY sys.dm_exec_sql_text(eqs.sql_handle) eqt
  order by eqs.last_execution_time desc
  特别的：只能知道首次和末次执行时间，如果每次执行的语句相同，则总次数会增加，但是不知道中间每次执行的具体时间
```
## mysql
```
--声明变量
declare 变量名称 类型;
--变量赋值
set 变量名=变量值;
select nextval('序列名称') into 变量名 form dual;
select count(1) into 变量名 from 表;

--分支语句
if 变量=1 then
     begin
     ...
     end
else
     begin
     ...
     end
end if

--创建存储过程
--mysql默认的分隔符是;号,解释器遇到;号就会认为这是一行可以执行的语句然后执行
--存储过程内部有一行或者多行普通的sql语句并且以;结束，所以需要使用delimiter把分隔符改成其它符号，避免误导解释器
delimiter $$
drop procedure if exists addHandler;
create procedure addHandler()
begin
     declare errorFlag int default 0;
     declare continue handler for sqlexception set errorFlag=1;
     start transaction;
     insert into student (name,age) values('张三',10);
     insert into student (name,age) values('李四',12);
     if errorFlag=1 then
          rollback;
     else
          commit;
     end if;
end  $$
--执行存储过程
call addHandler;
--异常处理
declare continue handler for sqlexception set errorFlag=1;
--异常处理
declare continue handler for sqlexception rollback;  
--更新语句（连表）
update 表1 别名1
join 表2 别名2 on 连接条件
set 别名1.列名1=别名2.列名2
where 筛选条件
```
## oracle
```
表名和列名称区分大小写,sql语句中的表名和列表都会被默认转为大写
场景:表名是小写,执行sql报错:表不存在或列不存在
原因:sql语句中的小写表名被转成大写,然后的表名称又是小写,导致找不到表
解决办法:sql中的表名加上双引号,oracle就不会自动把sql中表名转大写

oracle安装教程：
先只装数据库程序文件
然后使用net configer 工具设置监听
然后使用database configer工具安装数据库实例,调整字符集
完成安装

使用1：INSERT INTO TEST(ID,Name) VALUES(NEXT VALUE FOR 序列名称, 'allen')
使用2：SELECT NEXT VALUE FOR 序列名称

数据库客户端navicat lite依赖oci,所以需要安装oracle client或者odp.net,然后设置oci路径

TNS模式连接数据库,需要配置tsname.ora文件,文件路径为：{oracle client或者odp.net的根目录}/NetWork/ADMIN/tsname.ora
{oracle client或者odp.net的根目录}/NetWork/ADMIN/Simpale/下有示例ora文件,照着改即可

.net程序引用odp.net程序集,然后正常走ado.net即可

待研究：oracle提供新的100%托管程序集,应该可以不用走TSN模式连接了
```
## 死锁
```
在sqlserver中创建一个死锁的例子
第一步：创建2个临时表，并且插入数据
CREATE TABLE ##TableA (ID INT IDENTITY,Val CHAR(1) ) 
GO 
INSERT INTO ##TableA (Val) VALUES ('A'), ('B') 
GO 
CREATE TABLE ##TableB(ID INT IDENTITY,Val CHAR(1) ) 
GO 
INSERT INTO ##TableB (Val) VALUES ('C'), ('D') 
GO 
第二步：执行一个事务操作，然后新开一个查询窗口立即执行第三步
BEGIN TRANSACTION 
SELECT @@SPID AS ProcessID 
UPDATE ##TableA SET Val = 'E' WHERE ID = 1 
------------------------------------ 
WAITFOR DELAY '00:00:07' 
UPDATE ##TableB SET Val= N'G' WHERE ID = 1 
COMMIT 
SELECT Val, GETDATE() AS CompletionTime FROM ##TableA WHERE ID=1 
SELECT Val, GETDATE() AS CompletionTime FROM ##TableB WHERE ID=1 
第三步：执行另一个事物操作
BEGIN TRANSACTION
SELECT @@SPID AS ProcessID
UPDATE ##TableB SET Val = N'F' WHERE ID = 1
--------------------------------------
WAITFOR DELAY '00:00:07'
UPDATE ##TableA SET Val = N'H' WHERE ID = 1
COMMIT
SELECT Val, GETDATE() AS CompletionTime FROM ##TableA WHERE ID=1
SELECT Val, GETDATE() AS CompletionTime FROM ##TableB WHERE ID=1 	

死锁发生后，打开：数据库实例》管理》扩展事件》system_health》package0.event_file
执行过滤，name=xml_deadlock_report 就可以看到最近所有的死锁记录
很久以前的数据会被覆盖
写入会有延时，发生死锁后，需要过一会，才会被记录到这里

等价的查询语句如下：
--来源，微软的sqlserver文档，死锁指南章节
SELECT xdr.value('@timestamp', 'datetime') AS [Date],
    xdr.query('.') AS [Event_Data]
FROM (SELECT CAST([target_data] AS XML) AS Target_Data
            FROM sys.dm_xe_session_targets AS xt
            INNER JOIN sys.dm_xe_sessions AS xs ON xs.address = xt.event_session_address
            WHERE xs.name = N'system_health'
              AND xt.target_name = N'ring_buffer'
    ) AS XML_Data
CROSS APPLY Target_Data.nodes('RingBufferTarget/event[@name="xml_deadlock_report"]') AS XEventData(xdr)
ORDER BY [Date] DESC;
```
## 收缩日志、文件
```
```
let mssql=require('mssql')
let lodash=require('lodash')
let fs=require('fs')
let ejs=require('ejs')
let {env}=require('process')
let cfg={
    user:'sa',
    password:env.mssql_pwd,
    server:'127.0.0.1\\sqlexpress',
    database:'camundaworkflow',
    options:{
        encrypt:false
    }
}
let dictTypeMap = {};
dictTypeMap["text"]= "String";
dictTypeMap["uniqueidentifier"]= "java.util.UUID";
dictTypeMap["date"]= "java.util.Date";
dictTypeMap["time"]= "java.util.Date";
dictTypeMap["datetime2"]= "java.util.Date";
dictTypeMap["tinyint"]= "short";
dictTypeMap["smallint"]= "short";
dictTypeMap["int"]= "int";
dictTypeMap["real"]= "double";
dictTypeMap["money"]= "double";
dictTypeMap["datetime"]= "java.util.Date";
dictTypeMap["float"]= "double";
dictTypeMap["ntext"]= "String";
dictTypeMap["bit"]= "boolean";
dictTypeMap["decimal"]= "java.math.BigDecimal";
dictTypeMap["numeric"]= "double";
dictTypeMap["bigint"]= "long";
dictTypeMap["varchar"]= "String";
dictTypeMap["char"]= "String";
dictTypeMap["nvarchar"]= "String";
dictTypeMap["nchar"]= "String";
dictTypeMap["binary"]= "byte[]";
dictTypeMap["image"]= "byte[]";
dictTypeMap["longblob"]= "byte[]";
dictTypeMap["blob"]= "byte[]";
dictTypeMap["timestamp"]= "java.util.Date";
let templatestr=fs.readFileSync('./t4-mssql-template.ejs').toString('utf-8');
let packageName="org.azeroth.mssqlserverclient";
let targetDir="mssqlserverclient\\src\\main\\java\\org\\azeroth\\mssqlserverclient\\";
mssql.connect(cfg).then(()=>{
    return mssql.query(`select myremark.value as remark,
                        mytable.name as tableName,
                        myschema.name as schemaName,
                        mytype.name as typeName,
                        mycol.name,
                        mycol.max_length,
                        mycol.is_nullable,
                        mycol.is_identity
                        from sys.all_objects mytable
                        join sys.schemas myschema on myschema.schema_id=mytable.schema_id
                        join sys.all_columns mycol on mycol.object_id=mytable.object_id
                        join sys.types mytype on mytype.user_type_id=mycol.user_type_id
                        left join sys.extended_properties myremark on myremark.major_id=mycol.object_id and myremark.minor_id=mycol.column_id
                        where mytable.type_desc='USER_TABLE' and mytable.name!='sysdiagrams'`)
}).then(queryRt=>{
    lodash.forEach(queryRt.recordset,x=>x.typeName=dictTypeMap[x.typeName])
    let dictTable=lodash.groupBy(queryRt.recordset,x=>x.tableName)
    lodash.forEach(dictTable,(rows,tableName)=>{
        let codestr=ejs.render(templatestr,{packageName,tableName,columns:rows,schemaName:rows[0].schemaName})
        fs.writeFile(targetDir+tableName+".java",codestr,()=>{
            console.log("ok--"+tableName)
        })
    })
})
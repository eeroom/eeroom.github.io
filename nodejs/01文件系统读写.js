let libpath = require("path")
let libfs = require('fs')

async function main(params) {
    let rootPath = "D:/02ITCast/WEB前端基础20151023";
    let lstFile = [];
    let lstDir = [];
    lstDir.push(rootPath);

    while (lstDir.length > 0) {
        let cdir = await libfs.promises.opendir(lstDir.pop());
        let cfile = null;
        while ((cfile = await cdir.read()) != null) {
            if (cfile.isDirectory()) {
                lstDir.push(libpath.join(cdir.path, cfile.name))
                lstFile.push({
                    "id":libpath.join(cdir.path, cfile.name),
                    "parent":cdir.path,
                    "text":cfile.name,
                    "children": [],
                    "state": null
                })
            } else if (cfile.isFile()) {
                lstFile.push({
                    "id":libpath.join(cdir.path, cfile.name),
                    "parent":cdir.path,
                    "text":cfile.name,
                    "children": null,
                    "state": null
                })
            }
        }
    }

    lstFile.forEach(row=>{
        row.parentObj=lstFile.find(x=>x.id==row.parent)
        if(!row.parentObj) return
        row.parentObj.children.push(row)
    })

    let lstroot=lstFile.filter(row=>!row.parentObj)
    lstFile.forEach(row=>{
        delete row.parent
        delete row.parentObj
        row.id=row.id.replaceAll("D:\\02ITCast\\","").replaceAll("\\","/")
    })

    let jsonstr=JSON.stringify(lstroot)
    
    libfs.writeFile('./json.tmp',jsonstr,()=>{
        console.log("json.tmp写入成功")
    })

}

main()

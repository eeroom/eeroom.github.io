let path=require("path")
let fs= require('fs')
// console.log(path.join(__dirname,"/a/b.txt"))
// console.log(path.join(__dirname,"../a/b.txt"))

// console.log(path.basename("D:\\Code\\eeroom.github.io\\a\\b.txt",".txt"))
// console.log(module)

let dirpath="D:/02ITCast/spring5高级"
fs.readdir("D:/02ITCast/spring5高级",(err,files)=>{
    let pathjson= files.map(x=>({
        "id": "spring5高级/"+x,
        "text": x,
        "children": null,
        "state": null
    }))
    console.log(JSON.stringify(pathjson))
    fs.writeFileSync("D:/Code/Azeroth.Http/HttpFile/flashplayer/wmvplayer/pathjson.json",JSON.stringify(pathjson))
})

// module.exports={a:3
// }

// exports={
//     b:4
// }

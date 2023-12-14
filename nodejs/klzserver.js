let http=require("http");


function startserver(callback) {
    var server=http.createServer(function(req,res){
        res.setHeader("Content-Type","application/json");
        res.write(JSON.stringify({"aget":12,"name":"张三"}))
        res.end();
    });
    
    server.listen(8091,"localhost",function(){
        console.log("开始监听...");
        console.log("http://localhost:8091");
        callback&&callback();
    });
}

exports.startserver=startserver;


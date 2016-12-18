var httpserver = require("http");
var qs = require("querystring");
var url = require("url");
var fs = require("fs");
var bcu = require("./utils/BlockChainUtils");
_moneyY =0
_moneyJ =0
_moneyZ =0
_x=0

httpserver.createServer(onRequest).listen(3000);

function onRequest(request,response)
{
    var pathname = url.parse(request.url).pathname;
    if(pathname=="/")    //访问表单页面
    {

        var ObjBcu2 = new bcu();
        var args2 = [];
        args2.push("query");
        args2.push("a");
        ObjBcu2.chaincode.query(args2, function (err, res2, body) {
            var jsondataz = JSON.stringify(body.result.message);
            _moneyJ =JSON.stringify(body.result.message)
            console.log(_moneyJ)
            var ObjBcu3 = new bcu();
            var args3 = [];
            args3.push("query");
            args3.push("b");
            ObjBcu3.chaincode.query(args3, function (err, res3, body) {
                var jsondataz = JSON.stringify(body.result.message);
                _moneyY =JSON.stringify(body.result.message)
                console.log(_moneyY)
                response.writeHead(200,{"Content-Type":"text/html"});
                fs.readFile("index.html","utf-8",function(e,data){
                data = data + "</br></br><fieldset><legend>甲方的账本现为</legend>甲方："+ _moneyJ+" </fieldset></br></br><fieldset><legend>乙方的账本现为</legend>乙方："+ _moneyY+"</fieldset></div></body></html>"
                response.write(data);
                response.end();
                });
            });
        });
    }
    else if(pathname=="/b")    //处理post方式请求
    {   
        var urlstr="";
        request.addListener("data",function(postdata){
            urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
            var jsondata = qs.parse(urlstr);        //转换成json对象
            var decodedata = decodeURIComponent(urlstr);        //对表单数据进行解码
            console.log(jsondata.outperson)
            console.log(jsondata.inperson)
            console.log(jsondata.money)
            console.log(urlstr);
            console.log('toJson',JSON.stringify(jsondata));
            console.log(decodedata);
            urlstr = decodedata;
            if (jsondata.money != '' && jsondata.money != 0) {
                console.log("###### invoke start #########################")
                var ObjBcu = new bcu();
                var args = [];
                args.push("invoke")
                args.push(jsondata.outperson);
                args.push(jsondata.inperson);
                args.push(jsondata.money);
                _moneyZ= _moneyJ
                console.log('moneyj='+ _moneyJ)
                console.log('moneyz='+ _moneyZ)
                //arges = request.body.params.args;
                ObjBcu.chaincode.invoke(args, function (err, res1, body) {
                    checkab()
                    function checkab(){
                        console.log("111")
                        var ObjBcu2 = new bcu();
                        var args2 = [];
                        args2.push("query");
                        args2.push("a");
                        var ObjBcu3 = new bcu();
                        var args3 = [];
                        args3.push("query");
                        args3.push("b");
                        console.log("222")
                        ObjBcu2.chaincode.query(args2, function (err, res2, body) {
                            var jsondataz = JSON.stringify(body.result.message);
                            _moneyJ =JSON.stringify(body.result.message)
                            console.log("333")                            
                            // console.log(_moneyJ)
                            ObjBcu3.chaincode.query(args3, function (err, res3, body) {
                                var jsondataz = JSON.stringify(body.result.message);
                                _moneyY =JSON.stringify(body.result.message);
                                console.log('moneyj='+ _moneyJ)
                                console.log('moneyz='+ _moneyZ)
                                if (_moneyJ== _moneyZ){
                                    console.log("equal")
                                    checkab()
                                }else{
                                    console.log("not equal")
                                    response.writeHead(200,{"Content-Type":"text/html"});
                                    fs.readFile("index.html","utf-8",function(e,data){
                                    data = data + "</br></br><fieldset><legend>甲方的账本现为</legend>甲方："+ _moneyJ+" </fieldset></br></br><fieldset><legend>乙方的账本现为</legend>乙方："+ _moneyY+"</fieldset></div></body></html>";
                                    response.write(data);
                                    response.end();
                                    });
                                    return
                                }
                                // response.writeHead(200,{"Content-Type":"text/html"});
                                // fs.readFile("index.html","utf-8",function(e,data){
                                // data = data + "</br></br><fieldset><legend>甲方的账本现为</legend>甲方："+ _moneyJ+" </fieldset></br></br><fieldset><legend>乙方的账本现为</legend>乙方："+ _moneyY+"</fieldset></div></body></html>";
                                // response.write(data);
                                // response.end();
                                // });
                            });
                        });
                    };
                });
            }else{
                var ObjBcu2 = new bcu();
                var args2 = [];
                args2.push("query");
                args2.push("a");
                ObjBcu2.chaincode.query(args2, function (err, res2, body) {
                    var jsondataz = JSON.stringify(body.result.message);
                    _moneyJ =JSON.stringify(body.result.message)
                    console.log(_moneyJ)
                    var ObjBcu3 = new bcu();
                    var args3 = [];
                    args3.push("query");
                    args3.push("b");
                    ObjBcu3.chaincode.query(args3, function (err, res3, body) {
                        var jsondataz = JSON.stringify(body.result.message);
                        _moneyY =JSON.stringify(body.result.message)
                        console.log(_moneyY)
                        response.writeHead(200,{"Content-Type":"text/html"});
                        fs.readFile("index.html","utf-8",function(e,data){
                        data = data + "</br></br><fieldset><legend>甲方的账本现为</legend>甲方："+ _moneyJ+" </fieldset></br></br><fieldset><legend>乙方的账本现为</legend>乙方："+ _moneyY+"</fieldset></div></body></html>"
                        response.write(data);
                        response.end();
                        });
                    });

                });
            }
        });
    }
}
function querya(){
    var ObjBcu2 = new bcu();
    var args2 = [];
    args2.push("query");
    args2.push("a");
    ObjBcu2.chaincode.query(args2, function (err, res2, body) {
        var jsondataz = JSON.stringify(body.result.message);
        _moneyJ =JSON.stringify(body.result.message);
    });
    console.log('async moneyj'+ _moneyJ)    
}
function queryb(){
    var ObjBcu2 = new bcu();
    var args2 = [];
    args2.push("query");
    args2.push("b");
    ObjBcu2.chaincode.query(args2, function (err, res2, body) {
        var jsondataz = JSON.stringify(body.result.message);
        _moneyY =JSON.stringify(body.result.message)
    });
    console.log('async moneyj'+ _moneyY)        
}
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
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("index.html","utf-8",function(e,data){
        		response.write(data);
        		response.end();
		});
    }
    else if(pathname=="/b")    //处理post方式请求
	{
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("b.html","utf-8",function(e,data){
        		response.write(data);
        		response.end();
		});		
	}
    else if(pathname=="/a")    //处理post方式请求
	{
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("a.html","utf-8",function(e,data){
        		response.write(data);
        		response.end();
		});		
	}	
    else if(pathname=="/c")    //处理post方式请求
	{
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("c.html","utf-8",function(e,data){
        		response.write(data);
        		response.end();
		});		
	}	
    else if(pathname=="/RegistdQuery")    //处理post方式请求
	{
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("RegistdQuery.html","utf-8",function(e,data){
        		response.write(data);
        		response.end();
		});		
	}		
    else if(pathname=="/regist")    //处理post方式请求
	{
        var urlstr="";
        request.addListener("data",function(postdata){
            urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
            var jsondata = qs.parse(urlstr);        //转换成json对象
            var decodedata = decodeURIComponent(urlstr);        //对表单数据进行解码
            urlstr = decodedata;
            if (jsondata.Shanghu != '' && jsondata.Identity != '' && jsondata.ServerAddress != '' ) {
                var ObjBcu = new bcu();
                var args = [];
                args.push("InvokeRegist")
                args.push(jsondata.Identity);
                args.push(jsondata.Shanghu);				
                args.push(jsondata.ServerAddress);
			    ObjBcu.chaincode.invoke(args, function (err, res, body) {
					if (body.result.status == "OK") {
				        response.writeHead(200,{"Content-Type":"text/html"});
				        fs.readFile("success.html","utf-8",function(e,data){
				        		response.write(data);
				        		response.end();
						});		
					};	
				});
			};
		});
    }	
    else if(pathname=="/delete")    //处理post方式请求
	{
        var urlstr="";
        request.addListener("data",function(postdata){
            urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
            var jsondata = qs.parse(urlstr);        //转换成json对象
            var decodedata = decodeURIComponent(urlstr);        //对表单数据进行解码
            urlstr = decodedata;
            if (jsondata.Shanghu != '' && jsondata.Identity != '' && jsondata.ServerAddress != '' ) {
                var ObjBcu = new bcu();
                var args = [];
                args.push("InvokeDelete")
                args.push(jsondata.Identity);				
                args.push(jsondata.Shanghu);
			    ObjBcu.chaincode.invoke(args, function (err, res, body) {
					if (body.result.status == "OK") {
				        response.writeHead(200,{"Content-Type":"text/html"});
				        fs.readFile("success.html","utf-8",function(e,data){
				        		response.write(data);
				        		response.end();
						});		
					};	
				});
			};
		});
    }		
    else if(pathname=="/QueryDetails")    //处理post方式请求
	{
        var urlstr="";
        request.addListener("data",function(postdata){
            urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
			console.log(urlstr)
            var jsondata = qs.parse(urlstr);        //转换成json对象
            var decodedata = decodeURIComponent(urlstr);        //对表单数据进行解码
            urlstr = decodedata;
            if (jsondata.Identity != '') {
                var ObjBcu = new bcu();
                var args = [];
                args.push("QueryDetails")
                args.push(jsondata.Identity);
			    ObjBcu.chaincode.query(args, function (err, res, body) {
					if (body.result.status == "OK") {

				        response.writeHead(200,{"Content-Type":"text/html"});
				        fs.readFile("QueryDetails.html","utf-8",function(e,data){
							//var jsonx  = JSON.parse(body.result.message);
							console.log(body.result.message)					
							//console.log(jsonx.userName)							
							//data = data + "<td>" + jsonx.userName+ "</td><td>" + jsonx.identity + "</td><td>" + jsonx.money + "</td><td>" + jsonx.txtype + "</td><td>"  + jsonx.date + "</td><td>"    
							//data = data + "</td></tr></tbody></table></div></body>	"
							data = data +"<td>" + jsondata.Identity  + "</td><td>" + body.result.message +"</td>"	
							data = data + "</tr></tbody></table></div></body>"
							response.write(data);						
				        		response.end();
						});		
					};	
				});
			};
		});
    }
    else if(pathname=="/QueryRegisted")    //处理post方式请求
	{
        var urlstr="";
        request.addListener("data",function(postdata){
            urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
			console.log(urlstr)
            var jsondata = qs.parse(urlstr);        //转换成json对象
            var decodedata = decodeURIComponent(urlstr);        //对表单数据进行解码
            urlstr = decodedata;
            if (jsondata.Identity != '') {
                var ObjBcu = new bcu();
                var args = [];
                args.push("QueryRegisted")
                args.push(jsondata.Identity);
			    ObjBcu.chaincode.query(args, function (err, res, body) {
					if (body.result.status == "OK") {

				        response.writeHead(200,{"Content-Type":"text/html"});
				        fs.readFile("QueryRegisted.html","utf-8",function(e,data){
//							var jsonx  = JSON.parse(body.result.message);
//							console.log(jsonx.userName)							
//							data = data + "<td>" + jsonx.userName+ "</td><td>" + jsonx.identity + "</td><td>" + jsonx.address + "</td><td>"    
//							data = data + "</td></tr></tbody></table></div></body>	"
//				        		response.write(data);	
							data = data +"<td>" + jsondata.Identity  + "</td><td>" + body.result.message +"</td>"	
							data = data + "</tr></tbody></table></div></body>"
							response.write(data);									
				        		response.end();
						});		
					};	
				});
			};
		});
    };			
}

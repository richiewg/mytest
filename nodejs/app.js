var httpserver = require("http");
var qs = require("querystring");
var url = require("url");
var fs = require("fs");
var hfc = require("hfc");
console.log(" **** starting HFC sample ****");
var PEER_ADDRESS         = "7051";
var MEMBERSRVC_ADDRESS   = "7054";

var chain;
var chaincodeID = "ee5b24a1f17c356dd5f6e37307922e39ddba12e5d2e203ed93401d7d05eb0dd194fb9070549c5dc31eb63f4e654dbd5a1d86cbb30c48e3ab1812590cd0f78539"
chain = hfc.newChain("mychain");
chain.setKeyValStore( hfc.newFileKeyValStore('/tmp/keyValStore') );
console.log("member services address ="+MEMBERSRVC_ADDRESS);
console.log("peer address ="+PEER_ADDRESS);
chain.setMemberServicesUrl("grpc://"+MEMBERSRVC_ADDRESS);
chain.addPeer("grpc://"+PEER_ADDRESS);
chain.setDevMode(true);
//Deploy will not take long as the chain should already be running
chain.setDeployWaitTime(10);
chain.setInvokeWaitTime(10);
enroll();
// Enroll a user.
function enroll() {
   console.log("enrolling user admin ...");
   // Enroll "admin" which is preregistered in the membersrvc.yaml
   chain.enroll("admin", "Xurw3yU9zI0l", function(err, admin) {
      if (err) {
         console.log("ERROR: failed to register admin: %s",err);
         process.exit(1);
      }
      // Set this user as the chain's registrar which is authorized to register other users.
      chain.setRegistrar(admin);
   });
}

httpserver.createServer(onRequest).listen(1337);

function onRequest(request,response)
{
    var pathname = url.parse(request.url).pathname;
    if(pathname=="/")    //访问表单页面
    {
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("index.html","utf-8",function(e,data){
            data = data + "</br></br><fieldset><legend>甲方的账本现为</legend>甲方：100 </fieldset></br></br><fieldset><legend>乙方的账本现为</legend>乙方：200</fieldset></div></body></html>"
            response.write(data);
            response.end();
        });
    }
    else if(pathname=="/a")    //处理post方式请求
    {
        var urlstr="";
        request.addListener("data",function(postdata){
            urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
            var jsondata = qs.parse(urlstr);        //转换成json对象
            var decodedata = decodeURIComponent(urlstr);        //对表单数据进行解码
            console.log(urlstr);
            console.log('toJson',JSON.stringify(jsondata));
            console.log(decodedata);
            urlstr = decodedata;
            invoke()
        });
        request.addListener("end",function(){
            //response.writeHead(200,{"Content-Type":"text/plain; charset=utf-8"});
            response.writeHead(200,{"Content-Type":"text/html"});
            fs.readFile("index.html","utf-8",function(e,data){
                data = data + "</br></br><fieldset><legend>甲方的账本现为</legend>甲方：" + query() + " </fieldset></br></br><fieldset><legend>乙方的账本现为</legend>乙方：200</fieldset></div></body></html>"
                response.write(data);
                response.end();

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
            invoke()
        });
        request.addListener("end",function(){
            //response.writeHead(200,{"Content-Type":"text/plain; charset=utf-8"});
            response.writeHead(200,{"Content-Type":"text/html"});
            fs.readFile("index.html","utf-8",function(e,data){
                data = data + "</br></br><fieldset><legend>甲方的账本现为</legend>甲方：" + query() + " </fieldset></br></br><fieldset><legend>乙方的账本现为</legend>乙方：200</fieldset></div></body></html>"
                response.write(data);
                response.end();

            });

        });
    }

}
 // Query chaincode
function query() {
   console.log("querying chaincode ...");
   var userName = "JohnDoe";
   // registrationRequest
   var registrationRequest = {
       enrollmentID: userName,
       affiliation: "bank_a"
   };
   chain.registerAndEnroll(registrationRequest, function(error, user) {
       if (error) throw Error(" Failed to register and enroll " + userName + ": " + error);
       console.log("Enrolled %s successfully\n", userName);
   }); 
   // Construct a query request
   var queryRequest = {
      chaincodeID: chaincodeID,
      fcn: "query",
      args: ["a"]
   };
   // Issue the query request and listen for events
   var tx = user.query(queryRequest);
   tx.on('complete', function (results) {
      console.log("query completed successfully; results=%j",results);
      return results
   });
   tx.on('error', function (error) {
      console.log("Failed to query chaincode: request=%j, error=%k",queryRequest,error);
      process.exit(1);
   });
}
//Invoke chaincode
function invoke() {
   console.log("invoke chaincode ...");
   // Construct a query request
   var userName = "JohnDoe";
   // registrationRequest
   var registrationRequest = {
       enrollmentID: userName,
       affiliation: "bank_a"
   };
   chain.registerAndEnroll(registrationRequest, function(error, user) {
       if (error) throw Error(" Failed to register and enroll " + userName + ": " + error);
       console.log("Enrolled %s successfully\n", userName);
   }); 
   var invokeRequest = {
      chaincodeID: chaincodeID,
      fcn: "invoke",
      args: ["a", "b", "1"]
   };
   // Issue the invoke request and listen for events
   var tx = user.invoke(invokeRequest);
   tx.on('submitted', function (results) {
          console.log("invoke submitted successfully; results=%j",results);       
       });   
   tx.on('complete', function (results) {
      console.log("invoke completed successfully; results=%j",results);
   });
   tx.on('error', function (error) {
      console.log("Failed to invoke chaincode: request=%j, error=%k",invokeRequest,error);
      process.exit(1);
   });
}

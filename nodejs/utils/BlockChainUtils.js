/**
 * Created by wengjunj on 16/12/18.
 */
var request = require('request-json');
var cccfg = require('./ChainCodeCfg');
var client = request.createClient(cccfg.getPeerApiUrl());

function bcu() {
    var option = {
        jsonrpc: "2.0",
        method: " ",
        params: {
            type: 1,
            chaincodeID: {
                name: cccfg.getChainCodeName("8e5158e500344e11c818a15f54d3b7a6bcd06e8a746cacffa712e70824a497588ada2e3bacf76af5b66dd00ebcac6aa08e8d7236193e64d5679e3cd06e5b287b")
            },
            ctorMsg: {
                args: [" "]
		//	}
            },
            secureContext: "jim"
        },
        id: 3
    }
    this.chaincode = option;
	
    this.chaincode.deploy = function (args, cbfunc) {
        option.method = "deploy";
        option.params.ctorMsg.args = args;
        option.params.chaincodeID.name = '8e5158e500344e11c818a15f54d3b7a6bcd06e8a746cacffa712e70824a497588ada2e3bacf76af5b66dd00ebcac6aa08e8d7236193e64d5679e3cd06e5b287b';
        option.id = 1;
        client.post("chaincode", option, function (err, res, body) {
            cbfunc(err, res, body);
        });
    };
    this.chaincode.invoke = function (args, cbfunc) {
        option.method = "invoke";
        option.params.ctorMsg.args = args;
        option.params.chaincodeID.name = '8e5158e500344e11c818a15f54d3b7a6bcd06e8a746cacffa712e70824a497588ada2e3bacf76af5b66dd00ebcac6aa08e8d7236193e64d5679e3cd06e5b287b';
        option.id = 3;
        client.post("chaincode", option, function (err, res, body) {
            cbfunc(err, res, body);
        });
    };
    this.chaincode.query = function (args, cbfunc) {
        option.method = "query";
        option.params.ctorMsg.args = args;
        option.params.chaincodeID.name = '8e5158e500344e11c818a15f54d3b7a6bcd06e8a746cacffa712e70824a497588ada2e3bacf76af5b66dd00ebcac6aa08e8d7236193e64d5679e3cd06e5b287b';
        option.id = 5;
        console.log(args);
        client.post("chaincode", option, function (err, res, body) {
            cbfunc(err, res, body);

        });
    };

    this.chaincode.getChain = function (cbfunc) {
        client.get("chain", function (err, res, body) {
            cbfunc(err, res, body)
        });
    }
    this.chaincode.getBlock = function (blockID, cbfunc) {
        client.get("chain/blocks/" + blockID, function (err, res, body) {
            cbfunc(err, res, body)
        });
    }
};

module.exports = bcu;

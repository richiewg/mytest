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
                name: cccfg.getChainCodeName("e1344e8974ecfd013a73a2681bc83b64c8b075dd732d304459923d2de2e7114e7ea9893cce858a0b59c536deac36f3baf580e3ebe31c843c3865f578e2051fa0")
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
        option.params.chaincodeID.name = 'e1344e8974ecfd013a73a2681bc83b64c8b075dd732d304459923d2de2e7114e7ea9893cce858a0b59c536deac36f3baf580e3ebe31c843c3865f578e2051fa0';
        option.id = 1;
        client.post("chaincode", option, function (err, res, body) {
            cbfunc(err, res, body);
        });
    };
    this.chaincode.invoke = function (args, cbfunc) {
        option.method = "invoke";
        option.params.ctorMsg.args = args;
        option.params.chaincodeID.name = 'e1344e8974ecfd013a73a2681bc83b64c8b075dd732d304459923d2de2e7114e7ea9893cce858a0b59c536deac36f3baf580e3ebe31c843c3865f578e2051fa0';
        option.id = 3;
        client.post("chaincode", option, function (err, res, body) {
            cbfunc(err, res, body);
        });
    };
    this.chaincode.query = function (args, cbfunc) {
        option.method = "query";
        option.params.ctorMsg.args = args;
        option.params.chaincodeID.name = 'e1344e8974ecfd013a73a2681bc83b64c8b075dd732d304459923d2de2e7114e7ea9893cce858a0b59c536deac36f3baf580e3ebe31c843c3865f578e2051fa0';
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

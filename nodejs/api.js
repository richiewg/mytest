/**
 * http://usejsdoc.org/
 */
var express = require('express');
var router = express.Router();
var logger = require("../utils/logHelper").helper.logger;
var bcu = require("../utils/BlockChainUtils");


router.post('/post', function (req, res) {
    logger.debug("post22222222222");
    logger.debug(JSON.stringify(req.body));
    logger.debug(req.body.params);

    res.send(req.body.params);


});

router.post('/chaincode/invoke', function (req, res) {
    var ObjBcu = new bcu();
    logger.debug("post22222222222");
    logger.debug(JSON.stringify(req.body));
    logger.debug(req.body.params);
    arges = req.body.params.args;
    ObjBcu.chaincode.invoke(req.body.params.function, arges, function (err, res2, body) {
        logger.debug(JSON.stringify(res2));
        res.send(res2);
    });
});

router.post('/chaincode/query', function (req, res) {
    var ObjBcu = new bcu();
    logger.debug("post22222222222");
    logger.debug(JSON.stringify(req.body));
    logger.debug(req.body.params);
    arges = req.body.params.args;
    ObjBcu.chaincode.query(req.body.params.function, arges, function (err, res2, body) {
        logger.debug(JSON.stringify(body));
        res.send(body);
    });
});
router.post('/chaincode/deploy', function (req, res) {
    var ObjBcu = new bcu();
    logger.debug("post22222222222");
    logger.debug(JSON.stringify(req.body));

    if (!req.body.params) {
        res.send({error: "参数错误!!!"});
        return;
    }
    if (!req.body.params.pwd || !req.body.params.pwd != "jsbank123") {
        res.send({error: "参数错误!!!"});
        return;
    }

    logger.debug(req.body.params);
    //arges = req.body.params.args;

    ObjBcu.chaincode.deploy("init", [" "], function (err, res2, body) {
        logger.debug(JSON.stringify(body));
        if (err) {
            logger.debug(err)
            res.send(body);
            return;
        }
        require('../utils/ChainCodeCfg').setChainCodeName("sycoin", body.result.message);
        res.send(body);
    });
});
router.post('/bank/init', function (req, res) {
    var ObjBcu = new bcu();
    logger.debug(JSON.stringify(req.body));

    if (!req.body.params) {
        res.send({error: "参数错误!!!"});
        return;
    }
    if (!req.body.params.pwd || !req.body.params.pwd != "jsbank123") {
        res.send({error: "参数错误!!!"});
        return;
    }
    logger.debug(req.body.params);
    //arges = req.body.params.args;

    var args = [];
    args.push("0");
    args.push("0");
    args.push("10000");
    args.push("100");
    args.push("15");
    ObjBcu.chaincode.invoke("Initialize", args, function (err, res, body) {
        logger.debug(body);
        if (err) {
            res.send(body);
            return;
        }
        res.send(body);
    });
});
router.post('/bank/query', function (req, res) {
    var ObjBcu = new bcu();
    ObjBcu.chaincode.query("AccountBQuery", [], function (err, chaincodeRes, chaincodeBody) {
        res.send(chaincodeBody);
    });
});
router.post('/rate/query', function (req, res) {
    var ObjBcu = new bcu();
    ObjBcu.chaincode.query("QueryExchangeRate", [], function (err, chaincodeRes, chaincodeBody) {
        res.send(chaincodeBody);
    });
});

router.post('/account/c/reg', function (req, res) {
    mod = require('../module/modcReg');
    ObjMod = new mod(req, res);
    try {
        ObjMod.beforecheck(ObjMod.Execute);
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});

router.get('/account/query/c/:id', function (req, res) {
    mod = require('../module/modcQuery');
    ObjMod = new mod(req, res);
    try {
        ObjMod.beforecheck(ObjMod.Execute);
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});

router.post('/trade/point/exchange', function (req, res) {
    mod = require('../module/exchange');
    ObjMod = new mod(req, res);
    try {
        ObjMod.doMod();
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});
router.post('/trade/sycoin/gift', function (req, res) {
    mod = require('../module/gift');
    ObjMod = new mod(req, res);
    try {
        ObjMod.doMod();
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});
router.post('/trade/sycoin/buy', function (req, res) {
    logger.debug("/trade/sycoin/buy Start!");
    mod = require('../module/buy');
    ObjMod = new mod(req, res);
    try {
        ObjMod.doMod();
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});
router.post('/trade/c/query', function (req, res) {
    mod = require('../module/modcTradeQuery');
    ObjMod = new mod(req, res);
    try {
        ObjMod.beforecheck(ObjMod.Execute);
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});
router.post('/account/m/reg', function (req, res) {
    mod = require('../module/modmReg');
    ObjMod = new mod(req, res);
    try {
        ObjMod.beforecheck(ObjMod.Execute);
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});
router.get('/account/query/m/:id', function (req, res) {
    mod = require('../module/modmQuery');
    ObjMod = new mod(req, res);
    try {
        ObjMod.beforecheck(ObjMod.Execute);
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});
router.post('/trade/m/query', function (req, res) {
    mod = require('../module/modmTradeQuery');
    ObjMod = new mod(req, res);
    try {
        ObjMod.beforecheck(ObjMod.Execute);
    } catch (err) {
        ObjMod.RetStr.Error = err;
        res.send(ObjMod.RetStr);
        //打印出错误
        logger.error(err);
        //打印出错误的调用栈方便调试
        logger.error(err.stack);
    }
});

module.exports = router;
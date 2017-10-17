
'use strict';
var local = function() {}

local.SERVERURL = "http://127.0.0.1:30010";
local.postConfig = {
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
};
local.prototype.contractList = function(data, callback) {
    var _this = this;
    local.post('/contractList', data, callback);
}

local.prototype.addContract = function(data, callback) {
    var _this = this;
    local.post('/saveContract', data, callback);
}

local.prototype.delContract = function(data, callback) {
    var _this = this;
    local.post('/delContract', data, callback);
}

local.prototype.saveTx = function(data, callback) {
    var _this = this;
    local.post('/saveTransaction', data, callback);
}

local.prototype.transactionList = function(data, callback) {
    var _this = this;
    local.post('/transactionList', data, callback);
}

local.prototype.delTransaction = function(data, callback) {
    var _this = this;
    local.post('/delTransaction', data, callback);
}

local.post = function(path, data, callback) {
    //console.log("本地服务请求参数："+JSON.stringify(data));
    ajaxReq.http.post(this.SERVERURL + path,JSON.stringify(data), bity.postConfig).then(function(data) {
        //console.log("本地服务返回结果："+JSON.stringify(data));
        callback(data.data);
    }, function(data) {
        callback({ error: true, msg: "connection error", data: "" });
    });
}


module.exports = local;
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/net/websocket/Http.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3eb0dV2MidNvbs+zkZWlCVt', 'Http', __filename);
// scripts/net/websocket/Http.js

'use strict';

//var SystemConfig = require("SystemConfig");
var CustomHttpClient = require('CustomHttpClient');
var CustomHttpRequest = require('CustomHttpRequest');
cc.VERSION = 20170524;
var HTTP = cc.Class({
    extends: cc.Component,

    statics: {
        sessionId: 0,
        userId: 0,
        sendRequest: function sendRequest(path, data, handler, extraUrl) {
            if (extraUrl == null) {
                extraUrl = gHost;
            }
            cc.log("gHost", gHost, path);
            var requestURL = extraUrl + path;
            cc.log(requestURL, JSON.stringify(data));
            var customHttpRequest = new CustomHttpRequest();
            customHttpRequest.setRequestType('POST');
            customHttpRequest.setTimeout(5000);
            customHttpRequest.setUrl(requestURL);
            customHttpRequest.setData(JSON.stringify(data));
            CustomHttpClient.instance.send(customHttpRequest, function (customHttpRequest1) {
                if (customHttpRequest1) {
                    var ret = JSON.parse(customHttpRequest1.xhr.responseText);
                    handler(ret);
                } else {
                    handler(null, '网络错误');
                }
            });
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Http.js.map
        
//var SystemConfig = require("SystemConfig");
var CustomHttpClient = require('CustomHttpClient');
var CustomHttpRequest = require('CustomHttpRequest');
cc.VERSION = 20170524;
var HTTP = cc.Class({
    extends: cc.Component,

    statics: {
        sessionId: 0,
        userId: 0,
        sendRequest: function (path, data, handler, extraUrl) {
            if (extraUrl == null) {
                extraUrl = gHost;
            }
            cc.log("gHost", gHost, path)
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
        },
    },
});
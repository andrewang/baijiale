(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/net/http/CustomHttpClient.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba202iHtKpGAL1E1XjgfKIJ', 'CustomHttpClient', __filename);
// scripts/net/http/CustomHttpClient.js

'use strict';

var CryptoJS = require('CryptoJS');
var CustomHttpClient = cc.Class({
    extends: cc.Component,

    properties: {},

    send: function send(customHttpRequest, handler) {
        customHttpRequest.startTimeOutTimer(function () {
            handler(null, '网络超时');
        });
        var xhr = customHttpRequest.xhr;
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }
        var self = this;
        xhr.onreadystatechange = function () {
            self.onreadystatechange(customHttpRequest, handler);
        };
        switch (customHttpRequest._requestType) {
            case 'GET':
                {
                    xhr.open("GET", customHttpRequest._url, true);
                    xhr.send();
                }
                break;
            case 'POST':
                {
                    var timestamp = '1';
                    var md5RawData = 'm5IaxZxmBwrlc2O' + timestamp + customHttpRequest._data;
                    var sign = '' + CryptoJS.MD5(md5RawData);
                    var newUrl = customHttpRequest._url.indexOf('?') > 0 ? customHttpRequest._url + '&' : customHttpRequest._url + '?';
                    newUrl += 'timestamp=' + timestamp + '&sign=' + sign;
                    xhr.open("POST", newUrl, true);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.send(customHttpRequest._data);
                }
                break;
            case 'UPLOAD':
                {
                    xhr.open("POST", customHttpRequest._url, true);
                    if (cc.sys.isNative) {
                        // xhr.setRequestHeader('Content-Type','application/octet-stream');
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        console.log('上传的文件名为:' + customHttpRequest._fileName);
                        var data = jsb.fileUtils.getDataFromFile(customHttpRequest._fileName);
                        xhr.send(data);
                    } else {
                        xhr.send('hahahahahhahahahahhahhahahah');
                    }
                    console.log('上传地址:' + customHttpRequest._url);
                }
                break;
            case 'DOWNLOAD':
                {
                    xhr.responseType = 'arraybuffer';
                    xhr.open("GET", customHttpRequest._url, true);
                    xhr.send();
                    console.log('下载地址:' + customHttpRequest._url);
                }
                break;
        }
    },

    onreadystatechange: function onreadystatechange(customHttpRequest, handler) {
        var xhr = customHttpRequest.xhr;
        if (xhr.readyState === 4) {
            if (customHttpRequest.isEnd == true) {
                return;
            }
            customHttpRequest.clearTimeOutTimer();
            if (xhr.status >= 200 && xhr.status < 300) {
                var requestType = customHttpRequest._requestType;
                if (requestType == 'DOWNLOAD') {
                    if (cc.sys.isNative && xhr.response) {
                        jsb.fileUtils.writeDataToFile(new Uint8Array(xhr.response), customHttpRequest._fileName);
                        if (handler !== null && handler != undefined) {
                            handler(customHttpRequest);
                        }
                    } else {
                        console.log(xhr.responseText);
                    }
                } else {
                    if (handler !== null && handler != undefined) {
                        handler(customHttpRequest);
                    }
                }
            } else {
                if (handler !== null && handler != undefined) {
                    handler(null, xhr.status);
                }
            }
        }
    }

});

CustomHttpClient.instance = new CustomHttpClient();
module.exports = CustomHttpClient;

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
        //# sourceMappingURL=CustomHttpClient.js.map
        
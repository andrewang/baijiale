"use strict";
cc._RF.push(module, 'c59d1KJL/ZE4ZRLZre33ykV', 'CatalogHelper');
// scripts/common/record/CatalogHelper.js

'use strict';

var CatalogHelper = {};

CatalogHelper.getRecordCatalog = function () {
    if (cc.sys.isNative) {
        //var writablePath = jsb.fileUtils.getWritablePath();
        // return writablePath+'record/';
        //return writablePath;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'org/cocos2dx/javascript/RecordAndPlayHelper';
            var mathodName = 'getSdCardFile';
            var mathodSignature = '()Ljava/lang/String;';
            var writablePath = jsb.reflection.callStaticMethod(className, mathodName, mathodSignature);
            writablePath += '/';
            return writablePath;
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            return jsb.fileUtils.getWritablePath();
        }
    }
    return '';
};

CatalogHelper.getDownloadCatalog = function () {
    if (cc.sys.isNative) {
        //var writablePath = jsb.fileUtils.getWritablePath();
        // return writablePath+'download/';
        //return writablePath;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'org/cocos2dx/javascript/RecordAndPlayHelper';
            var mathodName = 'getSdCardFile';
            var mathodSignature = '()Ljava/lang/String;';
            var writablePath = jsb.reflection.callStaticMethod(className, mathodName, mathodSignature);
            writablePath += '/';
            return writablePath;
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            return jsb.fileUtils.getWritablePath();
        }
        //模拟器
        else {
                return jsb.fileUtils.getWritablePath();
            }
    }
    return '';
};

module.exports = CatalogHelper;

cc._RF.pop();
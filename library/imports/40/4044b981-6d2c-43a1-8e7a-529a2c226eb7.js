"use strict";
cc._RF.push(module, '4044bmBbSxDoY56UposIm63', 'LogMgr');
// scripts/common/logMgr/LogMgr.js

"use strict";

var LogMgr = {
    files: {},
    logStr: "",

    err: function err(filename, lineNumber, message, error) {
        // var dataArr = this.getJsFileDataArr(filename);
        // if (dataArr) {
        //     var jsFileName = "";
        //     var jsFileLineNum = 0;
        //     for (var index = lineNumber; index > 0; index--) {
        //         var data = dataArr[index];
        //         if (data.indexOf("// scripts/") >= 0 && data.indexOf(".js") >= 0) {
        //             jsFileName = data;
        //             jsFileLineNum = lineNumber - index - 3;
        //             break;
        //         }
        //     }
        //     this.append("################################################################\n");
        //     this.append(message + "\n");
        //     this.append("error in this file :  " + jsFileName + ":" + jsFileLineNum + "\n");
        //     for (var index = lineNumber - 1; index < dataArr.length && index < lineNumber + 5; index++) {
        //         this.append(dataArr[index] + "\n");
        //     }
        //     this.append("################################################################\n\n");
        // }
        this.append("################################################################\n");
        this.append(message + "\n");
        this.append("error in this file :  " + filename + ":" + lineNumber + "\n");
        this.append("tracesback : " + error);
        this.append("################################################################\n\n");
    },

    getJsFileDataArr: function getJsFileDataArr(filename) {
        var data = this.files[filename];
        if (!data) {
            var readDataStr = jsb.fileUtils.getStringFromFile(filename);
            data = readDataStr.split("\n");
        }
        return data;
    },

    append: function append(str) {
        if (this.logStr.length >= 20000) {
            this.logStr = this.logStr.substring(5000, this.logStr.length);
        }
        this.logStr += str;
    }
};

window.__errorHandler = LogMgr.err.bind(LogMgr);

exports = module.exports = LogMgr;

cc._RF.pop();
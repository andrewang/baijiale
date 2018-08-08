var CatalogHelper = require('CatalogHelper');
var CustomHttpClient = require('CustomHttpClient');
var CustomHttpRequest = require('CustomHttpRequest');

cc.Class({
    extends: cc.Component,

    properties: {
        _isRecording : false,
    },

    statics: {
        create: function () {
            this.instance = new this
            return this.instance
        },
        getInstance: function () {
            return this.instance
        },
    },

    // onTouchStart: function (touch) {
    //     this._isCanStart = this.isCanStart(touch);
    //     if (this._isCanStart == false && this._isRecording == true) {
    //         console.log(this._isCanStart);
    //         return;
    //     } else {
    //         //开始录制
    //         this._isCanStart = this.startRecord();
    //         if (this._isCanStart && this.recordStartEvent) {
    //             this.recordStartEvent.emit();
    //         }
    //     }
    // },

    // onTouchMove: function (touch) {
    //     if (this._isCanStart == false) {
    //         return;
    //     } else {
    //         if (this.recordMoveEvent) {
    //             var pos = this.node.parent.convertTouchToNodeSpaceAR(touch);
    //             var tempMoveType = (pos.y > this.node.y) ? this.MOVE_UP : this.MOVE_DOWN;
    //             if (tempMoveType != this._moveType) {
    //                 this._moveType = tempMoveType;
    //                 this.recordMoveEvent.emit([this._moveType]);
    //             }
    //         }
    //     }
    // },

    // onTouchEnd: function (touch) {
    //     console.log("------------onTouchEnd");
    //     if (this._isCanStart == false) {
    //         return;
    //     } else {
    //         this._isCanStart = false
    //         console.log("-------------onTouchEnd this._isCanStart == true");
    //         var second = this.tryToStopRecord();

    //     }
    // },

    // onTouchCancel: function (touch) {
    //     this.onTouchEnd(touch);
    // },

    startRecord: function () {
        if (this._isRecording == true) {
            return
        }
        this._startTime = new Date().getTime();
        if (cc.sys.isNative) {
            this._fileName = this.getNewFileName();
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var className = 'org/cocos2dx/javascript/RecordAndPlayHelper';
                var mathodName = 'startRecord';
                var mathodSignature = '(Ljava/lang/String;)Z';
                var param = this._fileName;
                var isCanStart = jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, param);
                console.log('andoird 录音返回' + isCanStart);
                this._isRecording = true;
                return isCanStart;
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                var className = 'RecordAndPlayHelper';
                var mathodName = 'startRecord:';
                var arg1 = this._fileName;
                jsb.reflection.callStaticMethod(className, mathodName, arg1);
                this._isRecording = true;
                return true;
            }
        }
        return true;
    },

    //moveType 0为取消发送 1为发送语音
    tryToStopRecord: function (moveType) {
        if (cc.sys.isNative) {
            this._moveType = moveType
            this._endTime = new Date().getTime();
            var deltaTime = this.getCurRecordTime();
            if (deltaTime < 1) {
                // this.node.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(this.stopRecord,this)));
                scheduleTimeOut(this.stopRecord, this, 0.3)
                // if(this.recordEndEvent){
                //     this.recordEndEvent.emit([this._fileName,0,this._moveType]);
                // } 
            } else {
                var second = this.stopRecord();
                // if(this.recordEndEvent){
                //     this.recordEndEvent.emit([this._fileName,second,this._moveType]);
                // } 
            }
        }
    },

    uploadVoice: function (deltaTime) {
        var requestURL = cc.netMgr._commonNetMgr.getGameServerIp() + "/voice?uid=" + gUserData.uid + "&rid=" + gUserData.roomInfo.room_num + "&second=" + deltaTime
        var customHttpRequest = new CustomHttpRequest();
        customHttpRequest.setRequestType('UPLOAD');
        customHttpRequest.setTimeout(5000);
        customHttpRequest.setUrl(requestURL);
        customHttpRequest.setFile(this._fileName)
        // customHttpRequest.setFile(cc.url.raw("resources/music/" + "please_cut_card.mp3"))
        CustomHttpClient.instance.send(customHttpRequest, function (customHttpRequest1) {
            if (customHttpRequest1) {
                var ret = JSON.parse(customHttpRequest1.xhr.responseText);
                // var ret = JSON.parse(customHttpRequest1);
                cc.log("上传录音", ret.url);
                this.testUrl = ret.url
                //发送录音
                cc.netMgr.request("room_chat", { type: 4, words: ret.url }, function (ret) {
                    
                }.bind(this))
            } else {
                cc.log(null, '网络错误');
            }
        }.bind(this))
    },

    downloadVoice: function (url) {
        url = url || this.testUrl
        var filePath = this.getFilePath(url);
        console.log('下载后的路径为:' + filePath);
        var customHttpRequest = new CustomHttpRequest();
        customHttpRequest.setRequestType('DOWNLOAD');
        customHttpRequest.setTimeout(10000);
        customHttpRequest.setUrl(url);
        customHttpRequest.setFile(filePath);
        CustomHttpClient.instance.send(customHttpRequest, function (customHttpRequest1) {
            if (customHttpRequest1) {
                // this.status = DecodeStatus;
                this.decodeFile(filePath)
                cc.musicMgr.playVoice(this.getPlayableFilePath(filePath))
                // this.playVoice(this.getPlayableFilePath(filePath))
            } else {
                console.log('网络出错');
                this.status = ErrorStatus;
            }
        }.bind(this));
    },

    testPlay: function () {
        cc.log("测试播放", this.getPlayableFilePath(this._fileName))
        cc.log("是否存在", jsb.fileUtils.isFileExist(this.getPlayableFilePath(this._fileName)))
        cc.musicMgr.playVoice(this.getPlayableFilePath(this._fileName))
    },

    // playVoice: function (filepath) {
    //     console.log('播放路径 = ' + filepath);
    //     if (filepath == '') {
    //         return;
    //     }
    //     if (cc.sys.isNative) {
    //         if (cc.sys.os == cc.sys.OS_ANDROID) {
    //             var className = 'org/cocos2dx/javascript/RecordAndPlayHelper';
    //             var mathodName = 'playVoice';
    //             var mathodSignature = '(Ljava/lang/String;)V';
    //             var param = filepath;
    //             jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, param);
    //         } else if (cc.sys.os == cc.sys.OS_IOS) {
    //             var className = 'RecordAndPlayHelper';
    //             var mathodName = 'playVoice:';
    //             var arg1 = filepath;
    //             jsb.reflection.callStaticMethod(className, mathodName, arg1);
    //         }
    //     }
    // },

    stopRecord: function () {
        console.log('停止录音');
        if (cc.sys.isNative) {
            var deltaTime = this.getCurRecordTime();
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var className = 'org/cocos2dx/javascript/RecordAndPlayHelper';
                var mathodName = 'stopRecord';
                var mathodSignature = '()V';
                jsb.reflection.callStaticMethod(className, mathodName, mathodSignature);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                var className = 'RecordAndPlayHelper';
                var mathodName = 'stopRecord';
                jsb.reflection.callStaticMethod(className, mathodName);
                this._fileName = deltaTime < 1 ? "" : this.convertToAmr(this._fileName);
            }
            this._isRecording = false;
            //上传录音
            cc.log("上传录音", deltaTime)
            if (this._moveType != 0 && deltaTime >= 1) {
                this.uploadVoice(deltaTime)
            }

            return deltaTime;
        }
        return 0;
    },

    convertToAmr: function (fileName) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'RecordAndPlayHelper';
            var mathodName = 'convertWAV:toAMR:';
            var arg1 = fileName;
            var arg2 = fileName.replace('.wav', '.amr');
            jsb.reflection.callStaticMethod(className, mathodName, arg1, arg2);
            return arg2;
        }
    },

    getNewFileName: function () {
        var time = new Date().getTime();
        var path = '';
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            path = CatalogHelper.getRecordCatalog() + time + '.amr';
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            path = CatalogHelper.getRecordCatalog() + time + '.wav';
        }
        console.log(path);
        return path;
    },

    getCurRecordTime: function () {
        var time = this._endTime - this._startTime;
        console.log(time / 1000);
        var floorSecond = Math.floor((time / 1000));
        var ceilSecond = Math.ceil((time / 1000));

        return (floorSecond >= 1 ? ceilSecond : floorSecond);
    },

    decodeFile: function (filePath) {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                // this.status = CompleteStatus;
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                var downLoadPath = filePath;
                var playableFile = this.getPlayableFilePath(filePath);
                var className = 'RecordAndPlayHelper';
                var mathodName = 'convertAMR:toWAV:';
                var arg1 = downLoadPath;
                var arg2 = playableFile;
                jsb.reflection.callStaticMethod(className, mathodName, arg1, arg2);
                // this.status = CompleteStatus;
            }
            console.log('decodeFile后status=' + this.status);
        } else {
            // this.status = CompleteStatus;
            console.log('非原生平台不能播放录音');
        }
    },

    getFilePath: function (url) {
        if (cc.sys.isNative) {
            var index = url.lastIndexOf('=');
            var filePath = url.slice(index + 1, url.length);
            filePath += '.amr';
            filePath = CatalogHelper.getDownloadCatalog() + filePath;
            return filePath;

            //test
            // return this._fileName;
        }
    },

    getPlayableFilePath: function (filePath) {
        // var downloadFilePath = this.getFilePath()
        var downloadFilePath = filePath
        // if (cc.sys.os == cc.sys.OS_IOS) {
        if (cc.sys.os != cc.sys.OS_ANDROID) {
            downloadFilePath = downloadFilePath.replace('.amr', '.wav');
        }
        return downloadFilePath;
    },

});

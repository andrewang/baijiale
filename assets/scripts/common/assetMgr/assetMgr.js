var BaseObj = require("BaseObj")
cc.Class({
    // extends: cc.Component,
    extends: BaseObj,

    properties: {
        _updating: false,
        masterManifestUrl: cc.RawAsset,
        testManifestUrl: cc.RawAsset,
    },

    // use this for initialization
    begin: function () {
        // if (!cc.sys.isNative) {
        //     cc.eventMgr.emit("enterEntry")
        //     return;
        // }
        // this.info = this.find("info")
        cc.log("3333444", jsb.fileUtils.getWritablePath())
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'bjl-remote-asset');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                cc.log("Verification passed : " + relativePath);
                return true;
            }
            else {
                cc.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        //检查更新
        this.checkUpdate()
    },

    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // this.info.string = "No local manifest file found, hot update skipped.";
                cc.common.showMsgBox({
                    type: 2, msg: "No local manifest file found, hot update skipped.", okCb: function () {
                        this.retry()
                    }.bind(this)
                })
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // this.info.string = "Fail to download manifest file, hot update skipped.";
                cc.common.showMsgBox({
                    // type: 2, msg: "Fail to download manifest file, hot update skipped.", okCb: function () {
                    type: 2, msg: "网络错误，请重新连接", okCb: function () {
                        // this.retry()
                        this.checkUpdate()
                    }.bind(this)
                })
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // this.info.string = "Already up to date with the latest remote version.";
                // cc.common.showMsgBox({
                //     type: 2, msg: "Already up to date with the latest remote version.", okCb: function () {
                        
                //     }.bind(this)
                // })
                cc.log("已经是最新版本")
                if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
                    cc.eventMgr.emit("enterEntry")
                }
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // this.info.string = 'New version found, please try to update.';
                // this.panel.checkBtn.active = false;
                // this.panel.fileProgress.progress = 0;
                // this.panel.byteProgress.progress = 0;
                // cc.common.showMsgBox({
                //     type: 2, msg: "检测有新的版本", okCb: function () {
                //          this.hotUpdate()
                //     }.bind(this)
                // })
                scheduleTimeOut(function () {
                    this.hotUpdate()
                }.bind(this), this, 0)
                
                break;
            default:
                return;
        }
        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    },

    checkUpdate: function () {
        if (this._updating) {
            // this.info.string = 'Checking or updating ...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            if ("Master" == versionType) {
                this._am.loadLocalManifest(this.masterManifestUrl);
            }
            else {
                this._am.loadLocalManifest(this.testManifestUrl);
            }
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            // this.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },

    // loadCustomManifest: function () {
    //     if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
    //         var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
    //         this._am.loadLocalManifest(manifest, this._storagePath);
    //         // this.panel.info.string = 'Using custom manifest';
    //     }
    // },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // this.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();
                this.find("pbFile").getComponent(cc.ProgressBar).progress = event.getPercent();
                this.find("pbByte").getComponent(cc.ProgressBar).progress = event.getPercentByFile();

                
                // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                this.find("fileDetail").string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.find("byteDetail").string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                // cc.log(event.getDownloadedBytes() + ' / ' + event.getTotalBytes())

                var msg = event.getMessage();
                if (msg) {
                    // this.panel.info.string = 'Updated file: ' + msg;
                    // this.info.string = 'Updated file: ' + msg;
                }
                cc.eventMgr.emit("hotUpdateProgress", event)
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // this.info.string = 'Fail to download manifest file, hot update skipped222.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // this.info.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                // this.info.string = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                // this.info.string = 'Update failed. ' + event.getMessage();
                // this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                // this.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                // this.info.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // this._am.loadLocalManifest(this.manifestUrl);
                if ("Master" == versionType) {
                    this._am.loadLocalManifest(this.masterManifestUrl);
                }
                else {
                    this._am.loadLocalManifest(this.testManifestUrl);
                }
            }

            this._failCount = 0;
            this._am.update();
            // this.panel.updateBtn.active = false;
            this._updating = true;
        }
    },

    retry: function () {
        if (!this._updating && this._canRetry) {
            // this.panel.retryBtn.active = false;
            this._canRetry = false;
            
            // this.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },

    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    },

});

(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/Chat/ChatView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6005b24wDZNsaIXn7QywK2A', 'ChatView', __filename);
// scripts/app/game/view/Chat/ChatView.js

"use strict";

var BaseView = require("BaseView");
var ChatConfig = require("ChatConfig");
var record = require("RecordMgr");
var gmList = [];
gmList.push("playVoice");
gmList.push("test");
gmList.push("#sex");
gmList.push("downloadVoice");

cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();

        var self = this;
        for (var i = 1; i <= 13; i++) {
            this.find(i).on('click', function (event) {
                // cc.log(event.target._name)
                var str = self.find(event.target._name)._children[0].getComponent(cc.Label).string;
                // str = str.substr(2) //前面两个字符不要了
                var voiceStr = ChatConfig.chatStage.toString() + cc.gameMgr._myData.user_base_info.gender.toString() + str;
                self.reqChat({ type: 1, words: voiceStr });
                var playVoice = "placeVoice/" + voiceStr + ".mp3";
                cc.log("playVoice: ", playVoice);
                cc.musicMgr.playEffect(playVoice);
            });
        }

        for (var i = 0; i <= 31; i++) {
            this.find("bq_" + i).on('click', function (event) {
                // cc.log(event.target._name)
                self.reqChat({ type: 3, words: event.target._name });
            });
        }
    },

    onEnable: function onEnable() {
        cc.log("onEnable: ChatView", ChatConfig.chatStage);
        this.find("content_1").y = 235;
        this.replaceCommonLanguage(Number(ChatConfig.chatStage));
    },

    showEmoji: function showEmoji() {
        this.find("page_1").active = false;
        this.find("page_2").active = true;
    },

    showUsefulLangue: function showUsefulLangue() {
        this.find("page_2").active = false;
        this.find("page_1").active = true;
    },

    onBtnSend: function onBtnSend() {
        // cc.log(this.find("txtContent").string)
        var chatstr = this.find("txtContent").string;
        if (chatstr == "") return;
        if (this.isGm(chatstr)) {
            this.handleGm(chatstr);
            return;
        }
        this.reqChat({ type: 2, words: chatstr });
    },

    //发送聊天
    reqChat: function reqChat(data) {
        cc.netMgr.request("room_chat", data, function (ret) {
            cc.netMgr.exec(ret, function () {
                this.find("txtContent").string = "";
            }.bind(this));
        }.bind(this));
        this.hide
        // this.GMCommond(data)
        // this.showBubbleTest(data)
        ();
    },

    // GMCommond: function (data) {
    //     if (data.words.match("#"))      //GM指令，更改性别，供给测试
    //     {
    //         cc.log("clientGMBegin")
    //         if (data.words.match("sex")) {
    //             var sex = data.words.match("1") ? 1 : 2
    //             cc.log("clientGMBegin   sex", sex)
    //             cc.gameMgr._myData.user_base_info.gender = sex
    //         }
    //     }
    // },

    // showBubbleTest: function (data) {
    //     var self = this
    //     this.find("test").active = true
    //     this.find("test").stopAllActions()
    //     this.find("test").runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
    //         self.find("test").active = false
    //     })))

    //     this.find("testLabel").node.active = false
    //     this.find("testEmoji").node.active = false
    //     //表情
    //     if (3 == data.type) {
    //         this.find("testEmoji").node.active = true
    //         this.find("test").setContentSize({ width: 94, height: 84 })
    //         // this.find("testEmoji").spriteFrame = this.find(data.words).getComponent(cc.Sprite).spriteFrame
    //         cc.resMgr.updateSprite(this.find("testEmoji"), "expression/" + data.words)
    //     }
    //     else if (2 == data.type) {
    //         this.find("testEmoji").node.active = true
    //         this.find("test").setContentSize({ width: 94, height: 84 })
    //         record.getInstance().downloadVoice(data.words)
    //     }
    //     else {
    //         this.find("testLabel").node.active = true
    //         this.find("testLabel").string = data.words
    //         var size = this.find("testLabel").node.getContentSize()
    //         this.find("test").setContentSize({ width: size.width + 30, height: size.height + 20 })
    //     }
    // },

    replaceCommonLanguage: function replaceCommonLanguage(stage) {
        for (var i = 1; i <= 13; i++) {
            this.find(i).active = false;
        }
        var chatList;
        switch (stage) {
            case 1:
                chatList = ChatConfig.puTong;
                break;
            case 2:
                chatList = ChatConfig.chaozhou;
                break;
            case 3:
                chatList = ChatConfig.jieyang;
                break;
            case 4:
                chatList = ChatConfig.shantou;
                break;
            default:
                cc.log("ERROR : ChatView.js replaceCommonLanguage() stage = ", stage);
                break;
        }
        var newsList = chatList[cc.gameMgr._myData.user_base_info.gender - 1];
        for (var index in newsList) {
            var element = newsList[index];
            var nodeName = (Number(index) + 1).toString();
            this.find(nodeName)._children[0].getComponent(cc.Label).string = element;
            this.find(nodeName).active = true;
        }
        this.find("content_1").height = 71 * newsList.length;
    },

    isGm: function isGm(str) {
        for (var i = 0; i < gmList.length; i++) {
            var element = gmList[i];
            if (IS_DEBUG && (element == str || -1 != str.indexOf(element))) {
                return true;
            }
        }
        return false;
    },

    handleGm: function handleGm(str) {
        if ("test" == str) {
            cc.netMgr.request("room_chat", { type: 4, words: "http://192.168.31.216:8203/voice?file=27811544271521776266" }, function (ret) {}.bind(this));
        } else if ("test" == str) {
            record.getInstance().testPlay();
        } else if (str.match("#sex")) {
            if (str.match("#")) //GM指令，更改性别，供给测试
                {
                    cc.log("clientGMBegin");
                    if (str.match("sex")) {
                        var sex = str.match("1") ? 1 : 2;
                        cc.log("clientGMBegin   sex", sex);
                        cc.gameMgr._myData.user_base_info.gender = sex;
                    }
                }
        } else if ("downloadVoice" == str) {
            // record.getInstance().downloadVoice("http://120.78.177.52:8203/voice?file=19691557791521768277")
            // record.getInstance().downloadVoice("http://192.168.31.216:8203/voice?file=27811544271521776266")
            record.getInstance().downloadVoice();
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
        //# sourceMappingURL=ChatView.js.map
        
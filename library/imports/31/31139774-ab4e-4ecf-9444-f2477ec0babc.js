"use strict";
cc._RF.push(module, '31139d0q05Oz5RE8kd+wLq8', 'JoinRoomView');
// scripts/app/lobby/view/JoinRoom/JoinRoomView.js

"use strict";

var BaseView = require("BaseView");
var http = require("Http");
var Code = require("Code");

cc.Class({
    extends: BaseView,

    properties: {
        moduleName: {
            override: true,
            default: "JoinRoom",
            // type: 'String',
            visible: false
        }
        // txtRoomId : cc.Label,
    },

    onLoad: function onLoad() {
        this._super();

        this.txtRoomId = this.find("txtRoomId");
        this.txtRoomId.string = "";
        this.layoutRoomId = this.find("layoutRoomId"
        // cc.eventMgr.emit("test", {bbb:"aaa", ccc:"dddd"})
        );for (var i = 1; i <= 6; i++) {
            this.layoutRoomId[i].string = "";
        }
    },

    onEnable: function onEnable() {
        this._super();
        this.onBtnClear
        //this.txtRoomId.string = ""

        //自动加入房间，方便调试
        // if (IS_DEBUG && (cc.sys.isBrowser || cc.sys.MACOS == cc.sys.platform)) {
        ();if (IS_DEBUG && cc.sys.isBrowser) {
            // cc.log(JSON.parse(cc.sys.localStorage.getItem('roomId')))
            this.mgr.requestJoin(JSON.parse(cc.sys.localStorage.getItem('roomId')));
        }
    },

    inputNum: function inputNum(event) {
        if (this.txtRoomId.string.length == 6) {
            return;
        }
        this.txtRoomId.string += event.target.name;
        this.showRoomId
        //加入房间
        ();if (this.txtRoomId.string.length == 6) {
            this.reqCheckRoomInfo(this.txtRoomId.string);
        }
    },

    showRoomId: function showRoomId() {
        for (var i = 1; i <= 6; i++) {
            this.layoutRoomId[i].string = "";
        }
        for (var i = 1; i <= this.txtRoomId.string.length; i++) {
            var num = this.txtRoomId.string.substring(i - 1, i);
            cc.log(this.layoutRoomId);
            this.layoutRoomId[i].string = num;
            // this.layoutRoomId.getChildByName(i).getComponent(cc.Label).string = num
        }
    },

    reqCheckRoomInfo: function reqCheckRoomInfo(roomId) {
        var self = this;
        http.sendRequest("/game/find_room", { room_num: roomId }, function (ret) {
            cc.log(ret
            //房间号错误，清空
            );if (ret.code != Code.OK) {
                this.onBtnClear();
            }
            cc.netMgr.exec(ret, function () {
                cc.log(ret
                //调试直接加入
                // if (IS_DEBUG && (cc.sys.isBrowser || cc.sys.MACOS == cc.sys.platform)) {
                );if (IS_DEBUG && cc.sys.isBrowser) {
                    self.mgr.requestJoin(ret.rid);
                }
                //先查询房间信息再让用户选择加不加入
                else {
                        var roomInfoView = cc.sceneNode.js.openView("prefabs/joinRoom/RoomInfoView");
                        roomInfoView.setData(clone(ret));
                        this.onBtnClear();
                        this.hide();
                    }
            }.bind(this));
        }.bind(this));
    },

    onBtnDelete: function onBtnDelete() {
        this.txtRoomId.string = this.txtRoomId.string.substring(0, this.txtRoomId.string.length - 1);
        this.showRoomId();
    },

    onBtnClear: function onBtnClear() {
        this.txtRoomId.string = "";
        this.showRoomId();
    }
});

cc._RF.pop();
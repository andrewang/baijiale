(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/BattleRecord/TotalBattleRecordView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb6ffvAHspLx6e7ioK0UEzv', 'TotalBattleRecordView', __filename);
// scripts/app/game/view/BattleRecord/TotalBattleRecordView.js

"use strict";

var BaseView = require("BaseView");
var http = require("Http");

cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
        this.svLayout = this.find("svLayout");
        this.noItemsLabel = this.find("noItemsLabel");

        this.find("scrollview").on('scroll-to-bottom', function () {
            this.reqGetData();
        }, this

        // this.test()
        );
    },

    reqGetData: function reqGetData() {
        var self = this;
        var data = { page: this.iPage, uid: gUserData.uid };
        http.sendRequest("/game/room_record", data, function (ret) {
            cc.log(ret);
            cc.netMgr.exec(ret, function () {
                self.addItem(ret.room_record_info_list);
                self.iPage++;
            });
        });
    },

    test: function test() {
        for (var i = 0; i < 12; i++) {
            var item = cc.instantiate(cc.res["prefabs/battleRecord/TotalBattleRecordItem"]);
            item.js = item.getComponent("TotalBattleRecordItem");
            item.parent = this.svLayout.node;
        }
        setTimeout(function () {
            cc.log("2222", this.svLayout, this.svLayout.node.getContentSize().height, this.svLayout._layoutSize.height);
            this.find("sv_content").setContentSize({ width: 960, height: this.svLayout.node.getContentSize().height - 120 });
        }.bind(this), 200);
    },

    addItem: function addItem(room_record_info_list) {
        this.noItemsLabel.node.active = false;
        for (var i = 0; i < room_record_info_list.length; i++) {
            var data = room_record_info_list[i];
            var item = cc.instantiate(cc.res["prefabs/battleRecord/TotalBattleRecordItem"]);
            item.js = item.getComponent("TotalBattleRecordItem");
            item.parent = this.svLayout.node;
            item.js.setData(data);
        }
        setTimeout(function () {
            this.find("sv_content").setContentSize({ width: 960, height: this.svLayout.node.getContentSize().height - 120 });
        }.bind(this), 200);
    },

    show: function show() {
        this._super();

        this.svLayout.node.removeAllChildren();
        this.totalHeight = 0;
        this.iPage = 1;
        this.reqGetData();
        if (this.noItemsLabel.node.active) {
            this.noItemsLabel.node.opacity = 0;
            this.noItemsLabel.node.runAction(cc.fadeTo(1, 255));
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
        //# sourceMappingURL=TotalBattleRecordView.js.map
        
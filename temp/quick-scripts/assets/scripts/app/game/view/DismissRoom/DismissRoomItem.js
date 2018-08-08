(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/DismissRoom/DismissRoomItem.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '284edOjuWRNGJ4aYcr4vxrO', 'DismissRoomItem', __filename);
// scripts/app/game/view/DismissRoom/DismissRoomItem.js

"use strict";

var BaseObj = require("BaseObj");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {
        this.find("imgAgree").node.active = false;
        this.node.active = false;
    },

    //data:{uid, agree}
    setData: function setData(data) {
        this.data = data;
        if (null == data) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        this.find("imgAgree").node.active = false;
        this.find("imgWait").node.active = false;
        if (1 == data.agree) {
            this.find("imgAgree").node.active = true;
        } else {
            this.find("imgWait").node.active = true;
        }
        if (!this.user_base_info) {
            this.user_base_info = cc.gameMgr.getPlayerInfoByUID(data.uid);
        }
        this.find("txtName").string = this.user_base_info.name;
        cc.resMgr.loadNetUrl(this.find("imgIcon").getComponent(cc.Sprite), this.user_base_info.avatar);
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
        //# sourceMappingURL=DismissRoomItem.js.map
        
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/player/PlayerInfoView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '307bccYFcFMq7zb3DRZRbSn', 'PlayerInfoView', __filename);
// scripts/app/game/player/PlayerInfoView.js

"use strict";

var BaseView = require("BaseView");
cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
    },

    //seatData:{user_base_info, seat}
    setData: function setData(data) {
        this.find("txtName").string = data.user_base_info.name;
        this.find("i18nId").string = i18n.dd_no + ": ";
        this.find("txtUid").string = data.user_base_info.ding_no;

        cc.resMgr.loadNetUrl(this.find("imgIcon"), data.user_base_info.avatar);
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
        //# sourceMappingURL=PlayerInfoView.js.map
        
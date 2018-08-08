(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/game/view/VersionVIew/VersionView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6f062raRgdFSJPubaw7Yuyh', 'VersionView', __filename);
// scripts/app/game/view/VersionVIew/VersionView.js

"use strict";

var BaseObj = require("BaseObj");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {
        // this.find("txtVersion").string = Version
        this.find("txtVersion").getComponent("cc.Label").string = txtVersion;
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
        //# sourceMappingURL=VersionView.js.map
        
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/lobby/view/RuleView/RuleView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8f2425pZB5PMIQruGc5fIeW', 'RuleView', __filename);
// scripts/app/lobby/view/RuleView/RuleView.js

"use strict";

var BaseView = require("BaseView");
cc.Class({
    extends: BaseView,

    properties: {},

    onLoad: function onLoad() {
        this._super();
        this.showView();
    },

    showView: function showView(sender) {
        // cc.log(this.find("toggle1").getComponent(cc.Toggle).isChecked)
        if (true == this.find("toggle1").getComponent(cc.Toggle).isChecked) {
            this.find("svGameRule").active = true;
            this.find("svJiPai").active = false;
        } else {
            this.find("svGameRule").active = false;
            this.find("svJiPai").active = true;
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
        //# sourceMappingURL=RuleView.js.map
        
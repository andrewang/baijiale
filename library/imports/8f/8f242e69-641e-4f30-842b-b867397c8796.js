"use strict";
cc._RF.push(module, '8f2425pZB5PMIQruGc5fIeW', 'RuleView');
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
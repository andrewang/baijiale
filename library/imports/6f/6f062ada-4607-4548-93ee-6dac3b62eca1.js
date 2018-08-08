"use strict";
cc._RF.push(module, '6f062raRgdFSJPubaw7Yuyh', 'VersionView');
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
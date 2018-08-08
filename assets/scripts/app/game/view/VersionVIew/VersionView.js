var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {
        
    },

    onLoad: function () {
        // this.find("txtVersion").string = Version
        if ("Master" == versionType) {
            this.find("txtVersion").getComponent("cc.Label").string = txtVersionMaster
            this.node.active = false
        }
        else {
            this.find("txtVersion").getComponent("cc.Label").string = txtVersionDev
            this.node.active = true
        }
    },
});

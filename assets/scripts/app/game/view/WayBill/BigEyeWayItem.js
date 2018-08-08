var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {
        
    },

    onLoad: function () {

    },

    setData: function (data) {
        this.data = data
        this.find("nodeYes").active = false
        this.find("nodeNo").active = false
        if (data) {
            this.find("nodeYes").active = true
        } else {
            this.find("nodeNo").active = true
        }
    },
});

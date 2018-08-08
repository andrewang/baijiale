var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        
    },

    onLoad: function () {
        this._super()
        this.showView()
    },

    showView: function (sender) {
        // cc.log(this.find("toggle1").getComponent(cc.Toggle).isChecked)
        if (true == this.find("toggle1").getComponent(cc.Toggle).isChecked) {
            this.find("svGameRule").active = true
            this.find("svJiPai").active = false
        } 
        else {
            this.find("svGameRule").active = false
            this.find("svJiPai").active = true
        }
    },
});

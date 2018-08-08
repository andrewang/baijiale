var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        
    },

    onLoad: function () {
        this._super()
    },

    //seatData:{user_base_info, seat}
    setData: function (data) {
        this.find("txtName").string = data.user_base_info.name
        this.find("i18nId").string = i18n.dd_no + ": "
        this.find("txtUid").string = data.user_base_info.ding_no
        
        cc.resMgr.loadNetUrl(this.find("imgIcon"), data.user_base_info.avatar)
    },
});

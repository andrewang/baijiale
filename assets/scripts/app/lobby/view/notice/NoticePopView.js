var BaseView = require("BaseView")

cc.Class({
    extends: BaseView,

    properties: {
        
    },

    onLoad: function () {
        this._super()
    },

    setData: function (data) {
        this.data = data
        this.find("txtTitle").string = data.title
        //策划说不要看到"闪"，所以等异步加载完再显示
        cc.resMgr.loadNetUrl(this.find("imgContent"), data.content, function () {
            this.show()
        }.bind(this))
        this.hide()
    },

    show: function () {
        this._super()
    },

    hide: function () {
        this._super()
    },

});

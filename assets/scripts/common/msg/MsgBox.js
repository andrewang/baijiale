var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super()
        var bg = this.node.getChildByName("bg")
        if (bg) {
            //MSBOX这里点击背景需要销毁，如果只是hide，会有奇怪的BUG，（进游戏点击两次解散房间，第一次点击背景调用hide，第二次退回到大厅，会发现
            //这个监听还在，但是this.node.active已经为false）暂时还不清楚什么原因
            bg.on(cc.Node.EventType.TOUCH_END, function (touch) {
                this.onBtnCancel()      //点击背景同等与点击取消按钮
                //this.node.destroy()
            }, this)
        }

        this.btnCancel = this.find("btnCancel")
        this.btnOk = this.find("btnOk")
        this.btnChongZhi = this.find("btnChongZhi")
        this.txtContent = this.find("txtContent")
    },

    setData: function (params) {
        this.txtContent.string = params.msg
        this.okCb = params.okCb
        this.cancleCb = params.cancleCb
        if (this.cancleCb) {
            this.btnCancel.active = true
        }
        else {
            this.btnCancel.active = false
            if (!params.chongZhi)
                this.cancleCb = params.okCb //如果只剩下确定按钮时，点击背景也是确定。不然解散房间会出现BUG
        }
        if (params.chongZhi){
            this.btnOk.active = false
            this.btnChongZhi.active = true
            this.btnCancel.active = true
        }else{
            this.btnOk.active = true
            this.btnChongZhi.active = false
        }
    },

    onBtnOk: function () {
        if (this.okCb) {
            this.okCb()
        }
        this.node.destroy()
        cc.common.clearMsgBox()
        // this.hide()
    },

    onBtnCancel: function () {
        if (this.cancleCb) {
            this.cancleCb()
        }
        this.node.destroy()
        cc.common.clearMsgBox()
        // this.hide()
    },
});

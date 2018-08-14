var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {
        //模块名字
        moduleName: {
            default: "",
            // type: 'String',
            visible: false,
        },
    },

    // ctor: function () {
    //     var Manager = require(this.moduleName+"Mgr")
    //     this.mgr = new Manager(this)
    // },

    onLoad: function () {
        this._super()
        if (this.moduleName != "") {
            this.mgr = this.node.addComponent(this.moduleName + "Mgr")
            this.mgr.view = this
        }
        
        // var bg = this.node.getChildByName("bg")
        // if (bg) {
        //     bg.on(cc.Node.EventType.TOUCH_END, function (touch) {
        //         this.hide()
        //     }, this)
        // }
        var body = this.node.getChildByName("body")
        if (body) {
            body.on(cc.Node.EventType.TOUCH_END, function (touch) {
                
            }, this)
        }
    },

    onEnable: function () {
        this.node.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.on('touchend', function (event) {
            event.stopPropagation();
        });
    },

    onDisable: function () {
        this.node.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.off('touchend', function (event) {
            event.stopPropagation();
        });
    },


    show: function () {
        this.node.active = true
    },

    hide: function () {
        this.node.active = false
    },

    isShow: function () {
        return this.node.active
    },

    onDestroy: function () {
        cc.log("BaseView:onDestroy", this.name)
    },
});

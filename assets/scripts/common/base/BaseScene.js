var BaseObj = require("BaseObj")
var BaseScene = cc.Class({
    extends: BaseObj,

    properties: {
        // //挂载所有该场景的plsit资源
        // SA_SHEET:{
        //     type:[cc.SpriteAtlas],
        //     default:[],
        // },

        // ARR_Prefab___:{
        //     type:[cc.Prefab],
        //     default:[],
        // },

        //模块名字
        moduleName: {
            override: true,
            default: "",
            // type: 'String',
            visible: false,
        },

        //子界面数组
        childViews: {
            type: cc.Prefab,
            default: [],
        },

        //子界面实例
        _childViewInstance: {
            default: []
        },

        loadingViewPrefab: cc.Prefab,
    },

    onLoad: function () {
        this._super()

        this.mgr = this.node.addComponent(this.moduleName + "Mgr")
        this.find("btnLog").active = false
        this.mgr.view = this
        // cc.common = this.node.getComponent('Common')
        cc.sceneNode = cc.director.getScene().getChildByName('Canvas')
        //msgbar这种东西切换场景需要继续显示，所以需要常驻节点
        if (!cc.gNode) {
            cc.gNode = new cc.Node('gNode')
            cc.game.addPersistRootNode(cc.gNode)
            cc.gNode.parent = cc.director.getScene()

            var Common = require("Common")
            cc.common = new Common()
            cc.common.init()
        }
        // //分辨率适配方案
        // var cvs = cc.sceneNode.getComponent(cc.Canvas);
        // var rate = cc.view.getFrameSize().width / cc.view.getFrameSize().height
        // if (rate >= 1280 / 720) {
        //     cvs.fitHeight = true
        //     cvs.fitWidth = false
        // }
        // else {
        //     cvs.fitHeight = false
        //     cvs.fitWidth = true
        // }
        //这里动态改变每个场景的适配方案，常驻节点也要动态适配
        this.adjustGnode()
        // scheduleTimeOut(function () {
        //     this.adjustGnode()
        // }.bind(this), this, 0)

        this.childViews = []
        this._childViewInstance = []

        cc.loader.loadRes("prefabs/versionView/VersionView", function (err, prefab) {
            var view = cc.instantiate(prefab)
            view.parent = this.node
            view.setLocalZOrder(100)
        }.bind(this))
    },

    start: function () {
        
    },

    //适配常驻节点
    adjustGnode: function () {
        var winSize = cc.director.getWinSize()
        var framesSize = cc.view.getFrameSize()
        // cc.log("111111", winSize.width, winSize.height)
        // cc.log("22222", framesSize.width, framesSize.height)
        // cc.log("33333", cc.view.getScaleX(), cc.view.getScaleY())
        if (framesSize.width < winSize.width) {
            cc.gNode.setContentSize({ width: winSize.width, height: winSize.height })
        }
        else {
            cc.gNode.setContentSize({ width: framesSize.width, height: framesSize.height })
        }
        cc.gNode.position = { x: cc.sceneNode.position.x, y: cc.sceneNode.position.y }
    },

    openView: function (url, parent, param) {
        var view = null
        if (this._childViewInstance[url]) {
            view = this._childViewInstance[url]
        } else {
            var prefab = cc.res[url]
            view = cc.instantiate(prefab)
            this._childViewInstance[url] = view
            view.parent = parent ? parent : this.node
        }
        view._components[0].show(param)
        view.js = view._components[0]
        return view.js
    },

    //某个界面是否打开
    isViewOnOpen: function (url) {
        var view = this._childViewInstance[url]
        if (view) {
            return view._components[0].isShow()
        }
        return false
    },

    openLogView: function () {
        this.openView("prefabs/logView/LogView")
        // cc.netMgr.onAppBack()
        // cc.netMgr.onAppFront()
    },

    on: function (name, callback) {
        // this.listener.push({name : name, callback : callback})
        // this.node.on(name, callback, this)
    },

    onDestroy: function () {
        // cc.log("BaseScene:onDestroy")
        // for (var key in this._childViewInstance) {
        //     cc.log("???", this._childViewInstance[key].name)
        // }
    },

    showLoadingView: function () {
        var view = null
        if (this._childViewInstance["loadingView"]) {
            view = this._childViewInstance["loadingView"]
        } else {
            view = cc.instantiate(this.loadingViewPrefab)
            this._childViewInstance["loadingView"] = view
            view.parent = this.node
        }
        view.setLocalZOrder(100)
        view._components[0].show()
        view.js = view._components[0]
        this.loadingView = view
        return view.js
    },

    hideLoadingView: function () {
        if (this.loadingView) {
            this.loadingView.js.hide()
        }
    },

});

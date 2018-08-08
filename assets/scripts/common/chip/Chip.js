// var BaseObj = require("BaseObj")
// cc.Class({
//     extends: BaseObj,

//     properties: {
//         value : 0,
//     },

//     onLoad: function () {
//         this._super()

//         this.init()
//     },

//     init: function () {
//         this.find("nodeSelected").node.active = false
//         //一开始游戏选择第一个筹码
//         if ("chip1" == this.node._name) {
//             this.find("nodeSelected").node.active = true
//         }
        
//         var self = this
//         this.node.on(cc.Node.EventType.TOUCH_END, function (touch) {
//             cc.gameMgr.view.unSelectAllChip()
//             self.setSelect(true)
//         }, this);
//     },

//     setData: function (value) {
//         this.value = value
//         this.find("imgBg").spriteFrame = cc.res["chip/chip_" + value]
//         this.find("txtNum").string = value
//     },

//     setSelect: function (bSelect) {
//         this.find("nodeSelected").node.active = bSelect
//     },

//     isSelect: function () {
//         return this.find("nodeSelected").node.active
//     }
// });

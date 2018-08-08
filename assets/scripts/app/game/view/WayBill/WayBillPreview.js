var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {
        
    },

    onLoad: function () {
        cc.eventMgr.addEvent("onWayBillPreviewSetData", this.setData, this)
        // this.setData()
    },

    setData: function (qipailuData) {
        var parent = this.find("nodeContent")
        // var parent = this.find("btnWayBillPreview")
        parent.removeAllChildren()
        function getNextPos(index) {
            var row = index % 6
            if (0 == row) {
                row = 6
            }
            var col = Math.ceil(index / 6)
            return { row: row, col: col }
        }

        // var qipailuData = cc.wayBillMgr.view.qipailuData
        var zhuang, xian, he
        zhuang = xian = he = 0
        //test
        // for (var i = 0; i < 100; i++) {
        //     var node = new cc.Node("New Sprite")
        //     var sprite = node.addComponent(cc.Sprite)
        //     node.parent = parent
        //     sprite.spriteFrame = cc.res["bigway/wayBillPreview3"]
        //     var pos = getNextPos(i + 1)
        //     var width = 25
        //     var height = 22
        //     node.position = { x: (pos.col - 1) * width + 50, y: (6 - pos.row) * height + 30 }
        // }
        for (var i = 0; i < qipailuData.length; i++) {
            var data = qipailuData[i]
            var node = new cc.Node("New Sprite")
            var sprite = node.addComponent(cc.Sprite)
            node.parent = parent
            if (-1 != data.state_list.indexOf(1)) {
                zhuang++
                sprite.spriteFrame = cc.res["waybill/wayBillPreview1"]
            }
            if (-1 != data.state_list.indexOf(2)) {
                xian++
                sprite.spriteFrame = cc.res["waybill/wayBillPreview2"]
            }
            if (-1 != data.state_list.indexOf(3)) {
                he++
                sprite.spriteFrame = cc.res["waybill/wayBillPreview3"]
            }

            var pos = getNextPos(i + 1)
            var width = 20.5
            var height = 21
            node.position = { x: (pos.col - 1) * width + width / 2, y: (6 - pos.row) * height + height / 2 - 2}
        }
        this.find("previewPoint1").string = zhuang
        this.find("previewPoint2").string = xian
        this.find("previewPoint3").string = he
    },

    onDestroy: function () {
        cc.eventMgr.removeEvent("onWayBillPreviewSetData", this.setData)
    },
});

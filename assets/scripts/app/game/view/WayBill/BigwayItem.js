var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {

    },

    onLoad: function () {

    },

    //data:{state_list, points, row, col, isHe};  state_list:[1,4,5]
    setData: function (data) {
        this.data = data
        data.state_list.sort()
        this.setHe(data.isHe)
        this.setFirstHe(data.isFirstHe)
        // var str = ""
        // for (var k in data.state_list) {
        //     //过滤 6，7（天牌）
        //     if (data.state_list[k] <= 5) {
        //         str += data.state_list[k]
        //     }
        // }
        // this.find("bg").spriteFrame = cc.res["bigway/bigway" + str]
        this.find("zd").node.active = false
        this.find("xd").node.active = false
        if (-1 != data.state_list.indexOf(1)) {
            this.find("bg").spriteFrame = cc.res["waybill/bigway_zhuang"]
        }
        if (-1 != data.state_list.indexOf(2)) {
            this.find("bg").spriteFrame = cc.res["waybill/bigway_xian"]
        }
        //庄对
        if (-1 != data.state_list.indexOf(4)) {
            this.find("zd").node.active = true
        }
        //闲对
        if (-1 != data.state_list.indexOf(5)) {
            this.find("xd").node.active = true
        }

        this.find("txtPoint").string = data.points
        var color = cc.Color.BLACK;
        //天牌变橙色
        if (-1 != data.state_list.indexOf(6) || -1 != data.state_list.indexOf(7)) {
            this.find("txtPoint").node.color = color.fromHEX("#FDB13F")
        } else {
            this.find("txtPoint").node.color = color
        }
    },

    setHe: function (isHe) {
        if (isHe) {
            this.find("isHe").node.active = true
        } else {
            this.find("isHe").node.active = false
        }
    },

    setFirstHe: function (isFirstHe) {
        if (isFirstHe) {
            this.find("isFirstHe").node.active = true
        } else {
            this.find("isFirstHe").node.active = false
        }
    },
});

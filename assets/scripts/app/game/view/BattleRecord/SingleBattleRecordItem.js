var BaseObj = require("BaseObj")
var serverRoomDesc = require("JoinRoomConfig").serverRoomDesc
var http = require("Http")
cc.Class({
    extends: BaseObj,

    properties: {
        
    },

    onLoad: function () {
        
    },

    setPoint: function (txt, point) {
        if (point >= 0) {
            point = parseFloat(point)
            txt.node.color = cc.Color.WHITE.fromHEX("#6DCFF6")
            txt.string = "+" + point
        } else {
            point = Math.abs(point)
            point = parseFloat(point)
            txt.node.color = cc.Color.WHITE.fromHEX("#ED1C24")
            txt.string = "-" + point
        }
    },

    //data:inning_record_info
    setData: function (data) {
        this.data = data
        
        var txtXianPoint = this.find("txtXianPoint")
        var txtZhuangPoint = this.find("txtZhuangPoint")
        
        txtXianPoint.string = data.player_points
        txtZhuangPoint.string = data.banker_points
        
        txtXianPoint.node.color = cc.Color.WHITE.fromHEX("#BFCDFF")
        txtZhuangPoint.node.color = cc.Color.WHITE.fromHEX("#BFCDFF")

        for (let i in data.state_info.state_list)
        {
            if (data.state_info.state_list[i] == 6)
                txtZhuangPoint.node.color = cc.Color.WHITE.fromHEX("#FFF799")
            if (data.state_info.state_list[i] == 7)
                txtXianPoint.node.color = cc.Color.WHITE.fromHEX("#FFF799")
        }
        // for (var i = 1; i <= 3; i++) {
        //     this.find("x" + i).active = false
        //     this.find("z" + i).active = false
        // }
        // for (var i = 0; i < data.player_cards_list.length; i++) {
        //     var cards_info = data.player_cards_list[i]
        //     this.find("x" + (i + 1)).active = true
        //     cc.resMgr.updateSprite(this.find("xsp" + (i + 1)), cc.resMgr.getCardResResultName({type : cards_info.type, num : cards_info.cards}))
        // }
        // for (var i = 0; i < data.banker_cards_list.length; i++) {
        //     var cards_info = data.banker_cards_list[i]
        //     this.find("z" + (i + 1)).active = true
        //     cc.resMgr.updateSprite(this.find("zsp" + (i + 1)), cc.resMgr.getCardResResultName({type : cards_info.type, num : cards_info.cards}))
        // }

        var newDate = new Date()
        newDate.setTime(data.open_inning_time * 1000)
        // this.find("txtTime").string = newDate.toLocaleString()
        this.find("txtTime").string = formatDate(newDate)
        var owner = this.find("owner").node
        // owner.txtName.string = this.owner_uid

        var nameString = this.owner_base_info.name
        if (this.getNameStringCount(nameString) > 10) {
            nameString = nameString.substr(0, this.getNameStringCount(nameString, 8)) + ".."
        }
        owner.txtName.string = nameString

        // owner.txtPoint.string = data.owner_profix.win_jetton
        this.setPoint(owner.txtPoint, data.owner_profix.win_jetton)
        cc.resMgr.loadNetUrl(this.find("owner").find("imgIcon"), this.owner_base_info.avatar)
        this.find("txtJu").string = data.inning_count

        for (var i = 1; i <= 9; i++) {
            var player = this.find("player" + i)
            player.node.active = false
        }

        var getSeatInfo = function (uid) {
            for (var i = 0; i < this.seat_info_list.length; i++) {
                if (this.seat_info_list[i].user_base_info.uid == uid) {
                    return this.seat_info_list[i]
                }
            }
        }.bind(this)

        data.user_profix_list.sort(function (a,b) {
            return a.uid - b.uid
        })
        for (var i = 0; i < data.user_profix_list.length; i++) {
            var user_profit = data.user_profix_list[i]
            var player = this.find("player" + (i + 1))
            player.node.active = true
            player.node.nodeOwner.node.active = false
            // player.node.txtName.string = user_profit.uid
            var seatInfo = getSeatInfo(user_profit.uid)

            var nameString = seatInfo.user_base_info.name
            if (this.getNameStringCount(nameString) > 10)
            {
                nameString = nameString.substr(0, this.getNameStringCount(nameString, 8)) + ".."
            }
            player.node.txtName.string = nameString

            // player.node.txtPoint.string = user_profit.win_jetton
            this.setPoint(player.node.txtPoint, user_profit.win_jetton)
            cc.resMgr.loadNetUrl(player.find("imgIcon"), seatInfo.user_base_info.avatar)
        }

        this.showMyselfBg()

        //这里根据人数改变item的大小
        // if (data.user_profix_list.length <= 3 && data.user_profix_list.length > 0) {
        //     this.find("layoutPlayer").setContentSize({width : 960, height : 250})
        //     this.node.setContentSize({width : 960, height : 250})
        // }
        // else if (data.user_profix_list.length <= 6 && data.user_profix_list.length > 3) {
        //     this.find("layoutPlayer").setContentSize({width : 960, height : 330})
        //     this.node.setContentSize({width : 960, height : 330})
        // }
        // else if (data.user_profix_list.length <= 9 && data.user_profix_list.length > 6)
        // {
        //     this.find("layoutPlayer").setContentSize({width : 960, height : 420})
        //     this.node.setContentSize({width : 960, height : 420})
        // }
        // else {
        //     this.find("layoutPlayer").setContentSize({width : 960, height : 170})
        //     this.node.setContentSize({width : 960, height : 170})
        // }
    },

    showMyselfBg: function () {
        if (this.data.owner_profix.uid == gUserData.uid) {
            this.find("owner").node.bg_myself.node.active = true
            return
        }

        for (var i = 0; i < this.data.user_profix_list.length; i++) {
            var user_profit = this.data.user_profix_list[i]
            var player = this.find("player" + (i + 1))
            if (user_profit.uid == gUserData.uid) {
                player.node.bg_myself.node.active = true
                return
            }
        }
    },

});

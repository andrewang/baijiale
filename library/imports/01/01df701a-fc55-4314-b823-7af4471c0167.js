"use strict";
cc._RF.push(module, '01df7Aa/FVDFLgjevRHHAFn', 'SingleResultItem');
// scripts/app/game/view/SingleResult/SingleResultItem.js

"use strict";

var BaseObj = require("BaseObj");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {},

    //data是{user_base_info, point} 。user_base_info:{uid, name, avatar, gender, diamonds}
    setData: function setData(data) {
        this.data = data;
        // this.find("txtName").string = data.user_base_info.name
        cc.resMgr.loadNetUrl(this.find("imgIcon"), data.user_base_info.avatar);

        var nameString = data.user_base_info.name;
        if (this.getNameStringCount(nameString) > 10) //最多容纳5个汉字
            {
                nameString = nameString.substr(0, this.getNameStringCount(nameString, 8)) + ".."; //大于5个汉字,取前4个汉子字符加..表示
            }
        this.find("txtName").string = nameString;
        var point = data.point - cc.gameMgr.view.getPlayerByUid(data.user_base_info.uid).js.betTotalValue; //玩家输赢数 = 玩家赢的筹码 - 下注耗费的筹码
        var color = cc.Color.WHITE;
        if (point >= 0) {
            this.find("txtPoint").node.color = color.fromHEX("#FFF568");
            this.find("txtPoint").string = "+" + point;
        } else {
            this.find("txtPoint").node.color = color.fromHEX("#ED1C24");
            this.find("txtPoint").string = point;
        }
    }
});

cc._RF.pop();
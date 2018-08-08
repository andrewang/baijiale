"use strict";
cc._RF.push(module, 'fbfb0aYJPtB4L2WyqjjmwW8', 'TotalResultItem');
// scripts/app/game/view/TotalResult/TotalResultItem.js

"use strict";

var BaseObj = require("BaseObj");
cc.Class({
    extends: BaseObj,

    properties: {},

    onLoad: function onLoad() {},

    //data是{user_base_info, point} 。user_base_info:{uid, name, avatar, gender, diamonds}
    setData: function setData(data, isRoomOwner) {
        this.data = data;
        // this.find("imgRoomOwner").node.active = isRoomOwner

        var nameString = data.user_base_info.name;
        if (this.getNameStringCount(nameString) > 10) //最多容纳5个汉字
            {
                nameString = nameString.substr(0, this.getNameStringCount(nameString, 8)) + ".."; //大于5个汉字,取前4个汉子字符加..表示
            }
        this.find("txtName").string = nameString;

        this.find("txtUid").string = "ID:" + data.user_base_info.ding_no;
        cc.resMgr.loadNetUrl(this.find("imgIcon"), data.user_base_info.avatar);

        if (data.point >= 0) {
            this.find("txtPoint").node.color = cc.Color.WHITE.fromHEX("#FFF200");
            this.find("txtPoint").string = "+" + data.point;
        } else {
            this.find("txtPoint").node.color = cc.Color.WHITE.fromHEX("#ED1C24");
            this.find("txtPoint").string = data.point;
        }
        this.showMyselfBg();
    },

    showMyselfBg: function showMyselfBg() {
        if (this.data.user_base_info.uid == gUserData.uid) {
            this.find("bg_myself").node.active = true;
        } else {
            this.find("bg_myself").node.active = false;
        }
    }
});

cc._RF.pop();
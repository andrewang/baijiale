(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/app/lobby/view/JoinRoom/JoinRoomConfig.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '98722exFY5BcYU+LO2saUsr', 'JoinRoomConfig', __filename);
// scripts/app/lobby/view/JoinRoom/JoinRoomConfig.js

"use strict";

//服务端的房间类型对应的描述
var serverRoomDesc = {};
serverRoomDesc["bet_limit_type"] = {};
serverRoomDesc["midway_join"] = {};
serverRoomDesc["squeeze_cards"] = {};
serverRoomDesc["inning_limit_type"] = {};
serverRoomDesc["inning_limit_type"][1] = "20局";
serverRoomDesc["inning_limit_type"][2] = "50局";
serverRoomDesc["inning_limit_type"][3] = "80局";
serverRoomDesc["midway_join"][1] = "允许中途加入";
serverRoomDesc["midway_join"][2] = "不允许中途加入";
serverRoomDesc["squeeze_cards"][1] = "翻动挤牌";
serverRoomDesc["squeeze_cards"][2] = "滑动挤牌";
serverRoomDesc["bet_limit_type"][1] = "1-1千";
serverRoomDesc["bet_limit_type"][2] = "10-1万";

module.exports = {
    serverRoomDesc: serverRoomDesc
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=JoinRoomConfig.js.map
        
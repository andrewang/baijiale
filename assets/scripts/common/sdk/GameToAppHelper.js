var serverRoomDesc = require("JoinRoomConfig").serverRoomDesc
var GameToAppHelper = {

};

GameToAppHelper.weChatRoomInvite = function () {//邀请微信进入房间
    var data = GameToAppHelper.getShareRoomInfo()
    var paramStr = JSON.stringify(data);
    console.log(paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'weChatRoomInvite';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'weChatRoomInvite:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};

GameToAppHelper.dingdingRoomInvite = function () {//丁丁邀请进入房间
    var data = GameToAppHelper.getShareRoomInfo()
    var paramStr = JSON.stringify(data);
    console.log(paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'dingdingRoomInvite';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'dingdingRoomInvite:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};

GameToAppHelper.shareGameToWeChatFriend = function () {//微信好友分享游戏
    var gameId = 1;
    var param = { 'gameId': gameId };
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'shareGameToWeChatFriend';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'shareGameToWeChatFriend:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};

GameToAppHelper.shareGameToWeChatMoment = function () {//微信朋友圈分享游戏
    var gameId = 1;
    var param = { 'gameId': gameId };
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'shareGameToWeChatMoment';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'shareGameToWeChatMoment:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};


GameToAppHelper.sharePicToWeChatMoment = function (imagePath) {//分享图片到微信朋友圈
    var roomId = gUserData.roomInfo.rid;
    var gameId = 1;
    var param = { 'roomId': roomId, 'gameId': gameId, 'shareImagePath': imagePath };
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'sharePicToWeChatMoment';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'sharePicToWeChatMoment:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};

GameToAppHelper.sharePicToDingdingMoment = function (imagePath) {//分享图片到丁丁朋友圈
    var roomId = gUserData.roomInfo.rid;
    var gameId = 1;
    var param = { 'roomId': roomId, 'gameId': gameId, 'shareImagePath': imagePath };
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'sharePicToDingdingMoment';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'sharePicToDingdingMoment:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};

GameToAppHelper.sharePicToWeChatFriend = function (imagePath) {//分享图片到微信好友
    var roomId = gUserData.roomInfo.rid;
    var gameId = 1;
    var param = { 'roomId': roomId, 'gameId': gameId, 'shareImagePath': imagePath };
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'sharePicToWeChatFriend';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'sharePicToWeChatFriend:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};

GameToAppHelper.sharePicToDingdingFriend = function (imagePath) {//分享图片到丁丁好友
    var roomId = gUserData.roomInfo.rid;
    var gameId = 1;
    var param = { 'roomId': roomId, 'gameId': gameId, 'shareImagePath': imagePath };
    var paramStr = JSON.stringify(param);
    console.log(paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'sharePicToDingdingFriend';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'sharePicToDingdingFriend:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};

GameToAppHelper.getGameEnterInitData = function () {//获取游戏关键信息
    var data = null;
    // var data = {'gameId':2,'uid':1,'uToken':'6N9but6KEJ1BjTUFsMDYUxWN9hRyRTb-','serverType':'local','gameData':{'clubId':1,'clubCtrlNum':0}};
    // data = JSON.stringify(data);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'getGameEnterInitData';
            var mathodSignature = '()Ljava/lang/String;';
            data = jsb.reflection.callStaticMethod(className, mathodName, mathodSignature);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'getGameEnterInitData';
            data = jsb.reflection.callStaticMethod(className, mathodName);
        }
    }
    console.log(data);
    return data;
};

GameToAppHelper.backToApp = function () {
    console.log('game小窗口');
    // cc.global.isSmallWindowMode = true;
    if (cc.sys.isNative) {
        // var tempClient = require('MjRequestSpecificClient');
        // var mjSoundHelper = require('MjSoundHelper');
        // tempClient.requestBusy(true);
        // cc.game.setFrameRate(24);
        // mjSoundHelper.stopBgMusic();
        // cc.musicMgr.stopLobbyBgm()
        cc.musicMgr.setEffectVolume(0) //返回应用停止所有音量
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'backToApp';
            var mathodSignature = '()V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'CommonHelper';
            var mathodName = 'backToApp';
            jsb.reflection.callStaticMethod(className, mathodName);
        }
    }
},

    GameToAppHelper.ExitGame = function () {
        console.log('ExitGame');
        cc.audioEngine.stopAll();
        cc.director.end();
        // if (cc.sys.isNative) {
        //     if (cc.sys.os == cc.sys.OS_ANDROID) {

        //     } else if (cc.sys.os == cc.sys.OS_IOS) {
        //         var className = 'AppContactHelper';
        //         var mathodName = 'ExitGame';
        //         jsb.reflection.callStaticMethod(className, mathodName);
        //     }
        // }
    },

    // GameToAppHelper.isIphoneX = function(){
    //     if(cc.sys.isNative){        
    //         if(cc.sys.os == cc.sys.OS_ANDROID){
    //             return false;
    //         }else if(cc.sys.os == cc.sys.OS_IOS){
    //             var className = 'AppContactHelper';
    //             var mathodName = 'isIphoneX';
    //             var isIponeX = jsb.reflection.callStaticMethod(className,mathodName); 
    //             return isIponeX;
    //         }  
    //     }
    //     return false;
    // },

    // GameToAppHelper.CopyFile = function(filePath1,filePath2){
    //     if(cc.sys.isNative){        
    //         if(cc.sys.os == cc.sys.OS_ANDROID){
    //             var className = 'org/cocos2dx/javascript/AppActivity';
    //             var mathodName = 'CopySdcardFile';
    //             var mathodSignature = '(Ljava/lang/String;Ljava/lang/String;)I';
    //             jsb.reflection.callStaticMethod(className,mathodName,mathodSignature,filePath1,filePath2);            
    //         }else if(cc.sys.os == cc.sys.OS_IOS){
    //         }  
    //     }
    // },


    GameToAppHelper.shareCreateClubGame = function () {//创建群房间
        var data = GameToAppHelper.getShareRoomInfo()

        var paramStr = JSON.stringify(data);
        console.log(paramStr);
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
                var mathodName = 'shareCreateClubGame';
                var mathodSignature = '(Ljava/lang/String;)V';
                jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                var className = 'AppContactHelper';
                var mathodName = 'shareCreateClubGame:';
                jsb.reflection.callStaticMethod(className, mathodName, paramStr);
            }
        }
    };

// GameToAppHelper.goToAgentPage = function(){//跳到代理页面
//     if(cc.sys.isNative){
//         if(cc.sys.os == cc.sys.OS_ANDROID){
//             var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
//             var mathodName = 'goToAgentPage';
//             var mathodSignature = '()V';
//             jsb.reflection.callStaticMethod(className,mathodName,mathodSignature);
//         }else if(cc.sys.os == cc.sys.OS_IOS){
//             var className = 'AppContactHelper';
//             var mathodName = 'goToAgentPage';
//             jsb.reflection.callStaticMethod(className,mathodName); 
//         }  
//     }
// };

// GameToAppHelper.executeRecharge = function(goodsId,payType,agentId){//充值
GameToAppHelper.executeRecharge = function (itemData, payType, agentId) {//充值
    // var GoodsConfig = require('GoodsConfig');
    // var goods = GoodsConfig.getGoodsById(goodsId);
    var param = { 'goodsId': itemData.id, 'payType': payType };
    if (agentId) {
        param.agentId = agentId;
    }
    param.amount = itemData.amount;
    param.price = itemData.money;
    param.giveAmount = itemData.give_amount;
    var paramStr = JSON.stringify(param);
    cc.log("调用充值", paramStr);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            var className = 'com/ddpkcc/dingding/ui/game/GameActivity';
            var mathodName = 'executeRecharge';
            var mathodSignature = '(Ljava/lang/String;)V';
            jsb.reflection.callStaticMethod(className, mathodName, mathodSignature, paramStr);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            var className = 'AppContactHelper';
            var mathodName = 'executeRecharge:';
            jsb.reflection.callStaticMethod(className, mathodName, paramStr);
        }
    }
};

GameToAppHelper.getShareRoomInfo = function () {
    var info = gUserData.roomInfo.room_setup_info
    var ruleDesc = ""
    // ruleDesc = ruleDesc + serverRoomDesc["inning_limit_type"][info.inning_limit_type] + ","
    ruleDesc = ruleDesc + info.inning_num + "局,"
    ruleDesc = ruleDesc + serverRoomDesc["midway_join"][info.midway_join] + ","
    ruleDesc = ruleDesc + serverRoomDesc["squeeze_cards"][info.squeeze_cards] + ","
    // ruleDesc = ruleDesc + "押注" + serverRoomDesc["bet_limit_type"][info.bet_limit_type]
    ruleDesc = ruleDesc + "押注" + info.low_bet + "-" + info.hig_bet
    cc.log(ruleDesc)
    
    if (gUserData.dingdingData.gameData) {
        var shareRoomInfo = {
            gameId: 1, roomId: gUserData.roomInfo.rid, roomNum: gUserData.roomInfo.room_num, userId: gUserData.uid,
            userName: gUserData.playerInfo.name, title: "百家乐", content: ruleDesc, clubId: gUserData.dingdingData.gameData.clubId,
            groupId: gUserData.dingdingData.gameData.groupId
        }
        return { "shareRoomInfo": shareRoomInfo }
    }
    else {
        return null
    }
}

module.exports = GameToAppHelper;

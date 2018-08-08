var BaseMgr = require("BaseMgr")
var Code = require("Code")
//后端下注类型转客户端数据
var clientBetState = require("GameConfig").clientBetState
var clientCardIndex = require("GameConfig").clientCardIndex
var stateEnmu = require("GameConfig").stateEnmu
var timeConfig = require("GameConfig").timeConfig

cc.Class({
  extends: BaseMgr,

  properties: {

  },

  onLoad: function () {
    //数据
    this._isRoomOwner = false
    //自己的座位数据，如果自己是房主，则和房主座位数据一样
    this._myData = null
    //其他玩家的座位数据
    this._otherPlayerDatas = null
    //房主座位数据
    this._roomOwnerData = null
    //庄家挤牌权的玩家的UID
    this.jipaiZhuangUid = null
    //闲家挤牌权的玩家的UID
    this.jipaiXianUid = null
    //当前拥有挤牌权的玩家UID
    this.curJipaiPlayerUid = null
    //当前阶段的开始时间戳
    this.curStateTime = null
    //下注数量统计 1：庄 2：闲 3：和 4：庄对 5：闲对
    this.totalBetNumList = [0, 0, 0, 0, 0, 0]
    this.curJushu = 0
    this.flipList = [] //翻牌队列


    this.initListener()
    cc.gameMgr = this

    //同步时间
    this.syncTimeInterval = setInterval(function () {
      cc.netMgr.request("user_ntp_net_time", { ct: 0 }, function (ret) {
        cc.netMgr.exec(ret, function () {
          var curTime = Date.parse(new Date()) / 1000
          timeOffset = curTime - ret.st
        })
      })
    }, 1000)
  },

  update: function () {
    cc.netMgr.handleData()
  },

  initListener: function () {
    cc.eventMgr.addEvent("on_room_leave", this.onRoomLeave, this)
    cc.eventMgr.addEvent("on_room_join", this.onRoomJoin, this)
    cc.eventMgr.addEvent("on_room_game_status_change", this.onGameStateChanged, this)
    cc.eventMgr.addEvent("on_room_game_cut_cards", this.on_room_game_cut_cards, this)
    cc.eventMgr.addEvent("on_room_game_betting", this.on_room_game_betting, this)
    cc.eventMgr.addEvent("on_room_game_send_cards", this.on_room_game_send_cards, this)
    cc.eventMgr.addEvent("on_room_game_compare_cards", this.on_room_game_compare_cards, this)
    cc.eventMgr.addEvent("on_room_game_squeeze_cards", this.on_room_game_squeeze_cards, this)
    cc.eventMgr.addEvent("on_room_game_squeeze_cards_pos", this.on_room_game_squeeze_cards_pos, this)
    cc.eventMgr.addEvent("on_room_game_squeeze_cards_square", this.on_room_game_squeeze_cards_square, this)
    cc.eventMgr.addEvent("on_room_game_mend_cards", this.on_room_game_mend_cards, this)
    cc.eventMgr.addEvent("on_settle_accounts_inning", this.on_settle_accounts_inning, this)
    cc.eventMgr.addEvent("on_settle_accounts_finish", this.on_settle_accounts_finish, this)
    cc.eventMgr.addEvent("on_settle_accounts_midway", this.on_settle_accounts_midway, this)
    cc.eventMgr.addEvent("on_room_game_trans_permi", this.on_room_game_trans_permi, this)
    cc.eventMgr.addEvent("on_room_chat", this.on_room_chat, this)
    cc.eventMgr.addEvent("on_room_game_clear_bet", this.on_room_game_clear_bet, this)
    cc.eventMgr.addEvent("on_room_game_cut_cards_pos", this.on_room_game_cut_cards_pos, this)
  },

  onDestroy: function () {
    this._super()
    cc.eventMgr.removeEvent("on_room_leave", this.onRoomLeave)
    cc.eventMgr.removeEvent("on_room_join", this.onRoomJoin)
    cc.eventMgr.removeEvent("on_room_game_status_change", this.onGameStateChanged, this)
    cc.eventMgr.removeEvent("on_room_game_cut_cards", this.on_room_game_cut_cards, this)
    cc.eventMgr.removeEvent("on_room_game_betting", this.on_room_game_betting, this)
    cc.eventMgr.removeEvent("on_room_game_send_cards", this.on_room_game_send_cards, this)
    cc.eventMgr.removeEvent("on_room_game_compare_cards", this.on_room_game_compare_cards, this)
    cc.eventMgr.removeEvent("on_room_game_squeeze_cards", this.on_room_game_squeeze_cards, this)
    cc.eventMgr.removeEvent("on_room_game_squeeze_cards_pos", this.on_room_game_squeeze_cards_pos, this)
    cc.eventMgr.removeEvent("on_room_game_squeeze_cards_square", this.on_room_game_squeeze_cards_square, this)
    cc.eventMgr.removeEvent("on_room_game_mend_cards", this.on_room_game_mend_cards, this)
    cc.eventMgr.removeEvent("on_settle_accounts_inning", this.on_settle_accounts_inning, this)
    cc.eventMgr.removeEvent("on_settle_accounts_finish", this.on_settle_accounts_finish, this)
    cc.eventMgr.removeEvent("on_settle_accounts_midway", this.on_settle_accounts_midway, this)
    cc.eventMgr.removeEvent("on_room_game_trans_permi", this.on_room_game_trans_permi, this)
    cc.eventMgr.removeEvent("on_room_chat", this.on_room_chat, this)
    cc.eventMgr.removeEvent("on_room_game_clear_bet", this.on_room_game_clear_bet, this)
    cc.eventMgr.removeEvent("on_room_game_cut_cards_pos", this.on_room_game_cut_cards_pos, this)

    clearInterval(this.syncTimeInterval)
  },

  //重置牌局
  reset: function () {
    this.jipaiZhuangUid = null
    this.jipaiXianUid = null
    this.curJipaiPlayerUid = null

    this.view.reset()
    this.totalBetNumList = [0, 0, 0, 0, 0, 0]
    this.view.updateTotalBetInfo()

    this.flipList = [] //翻牌队列
    this.delaySqueezeData = null
  },

  onGameStateChanged: function (ret) {
    this.curStateTime = ret.game_status_begin_time
    gUserData.roomInfo.game_status = ret.status
    this.view.find("nodeChip").active = (stateEnmu.BETTING == ret.status || stateEnmu.BETTING_DELAY == ret.status) && !this.isRoomOwner()
    // cc.log("======时间 status, curStateTime, clientTime", ret.status, this.curStateTime, getCurTime())
    //切牌
    if (stateEnmu.CUT_CARDS == ret.status) {
      gUserData.roomInfo.room_status = "start"
      cc.musicMgr.playEffect("please_cut_card.mp3")
      this.view.find("nodeBtnOwner").active = false
      this.view.find("nodeBtnPlayer").active = false
      this.view.find("start_bg").node.active = false
      this.view.find("cutPoker").active = true
    } else if (stateEnmu.BETTING == ret.status) {
      cc.musicMgr.playEffect("please_bet.mp3")
      // this.reset()
      //启动下注倒计时
      var betLeftTime = timeConfig.BETTING_TIME_LIMIT - (getCurTime() - this.curStateTime)
      for (var i = 1; i <= 9; i++) {
        var player = this.view.find("player" + i)
        if (player.data) {
          player.launchTimer(betLeftTime, timeConfig.BETTING_TIME_LIMIT)
        }
      }
    } else if (stateEnmu.BETTING_DELAY == ret.status) {
      var betLeftTime = timeConfig.BETTING_DELAY_TIME_LIMIT - (getCurTime() - this.curStateTime)
      for (var i = 1; i <= 9; i++) {
        var player = this.view.find("player" + i)
        if (player.data) {
          player.launchTimer(betLeftTime, timeConfig.BETTING_DELAY_TIME_LIMIT)
        }
      }
    } else {
      for (var i = 1; i <= 9; i++) {
        var player = this.view.find("player" + i)
        if (player.data) {
          player.hideTimer()
        }
      }
    }

    // 只有在转移挤牌权阶段才能显示那个转移的东西
    if (stateEnmu.TRANS_PERMI == ret.status) {
      //启动转移挤牌倒计时
      var transLeftTime = timeConfig.TRANS_PERMI_TIME_LIMIT - (getCurTime() - this.curStateTime)
      for (var i = 1; i <= 9; i++) {
        var player = this.view.find("player" + i)
        if (player.data) {
          player.launchTimer(transLeftTime, timeConfig.TRANS_PERMI_TIME_LIMIT)
        }
      }
      // if (this.jipaiZhuangUid) {
      //   this.view.getPlayerByUid(this.jipaiZhuangUid).pb_timer.active = true
      // }
      // if (this.jipaiXianUid) {
      //   this.view.getPlayerByUid(this.jipaiXianUid).pb_timer.active = true
      // }
      this.showPowerObjTimer()

    } else {

    }
  },

  //开始挤牌
  on_room_game_squeeze_cards_square: function (ret) {
    if (this.view.isExitOneCardOnMove()) {
      this.delaySqueezeData = ret
      return
    }
    //庄挤牌
    var btnFlip = null
    if (1 == ret.state) {
      this.curJipaiPlayerUid = this.jipaiZhuangUid
      btnFlip = this.view.btnFlipZhuang
    }
    else {
      this.curJipaiPlayerUid = this.jipaiXianUid
      btnFlip = this.view.btnFlipXian
    }
    this.view.handleSqueeze(ret)
    //倒计时    
    for (var i = 1; i <= 9; i++) {
      var player = this.view.find("player" + i)
      if (player.data) {
        player.hideTimer()
      }
    }
    var jiLeftTime = timeConfig.SQUEEZE_CARDS_TIME_LIMIT - (getCurTime() - this.curStateTime)
    var player = this.view.getPlayerByUid(this.curJipaiPlayerUid)
    if (player) {
      player.launchTimer(jiLeftTime, timeConfig.SQUEEZE_CARDS_TIME_LIMIT)
    }
    if (this.curJipaiPlayerUid == gUserData.uid) {
      btnFlip.launchTimer(jiLeftTime, timeConfig.SQUEEZE_CARDS_TIME_LIMIT)
    }
  },

  //挤牌位置同步
  on_room_game_squeeze_cards_pos: function (ret) {
    var index = ret.pos.index
    var card = this.view.cardList[index]
    var pos = ret.pos
    if (this.getSqueezeType() == squeezeType.threeD) {
      var threeDCardJs = card.js.threeDCardJs
      if (threeDCardJs && pos.isRotate) {
        threeDCardJs.rotate()
      }
      else if (threeDCardJs && pos.ratioVal) {
        threeDCardJs.ratioVal = pos.ratioVal
      }
    } else if (this.getSqueezeType() == squeezeType.slider) {
      if (pos.x && pos.y) {
        var touchNode = card.js.find("cardMove").node
        touchNode.position = { x: pos.x, y: pos.y }
      }
    }
  },

  //挤牌时下发
  on_room_game_squeeze_cards: function (ret) {
    //翻开所有牌
    if (null == ret.index) {
      for (var i = 1; i <= 2; i++) {
        var index = clientCardIndex[ret.state][i]
        this.flipList.push(index)
      }
    } else {
      var index = clientCardIndex[ret.state][ret.index]
      this.flipList.push(index)
    }
    this.checkFlip()
    // this.checkHideFlipBtn()
  },

  checkHideFlipBtn: function () {
    var list = this.view.getNeedSqueezeCard()

    if (list.length == 0) {
      this.view.btnFlipXian.getComponent("FlipBtn").hideTimer()
      this.view.btnFlipZhuang.getComponent("FlipBtn").hideTimer()
    }
  },

  checkFlip: function () {
    //是否有扑克在翻牌中
    var isOnFlip = function () {
      for (var i = 1; i <= 6; i++) {
        if (this.view.cardList[i].js.isOnFlip()) {
          return true
        }
      }
      return false
    }.bind(this)

    if (isOnFlip()) {
      return
    }
    if (this.flipList.length != 0) {
      var index = this.flipList[0]
      this.flipList.splice(0, 1)
      this.view.cardList[index].js.flip()
    }
    this.checkHideFlipBtn()
  },

  //比牌
  on_room_game_compare_cards: function (ret) {
    this.view.compareCards(ret)
  },

  on_room_game_send_cards: function (ret) {
    if (0 == this.curJushu) {
      cc.musicMgr.playEffect("feipai.mp3")
    }
    this.view.dealCards(ret)
    if (this.wayBillView) {
      this.wayBillView.hide()
    }
    if (this.singleResultView) {
      this.singleResultView.hide()
    }
  },

  on_room_game_mend_cards: function (ret) {
    this.view.buCards(ret)
  },

  //下注
  on_room_game_betting: function (ret) {
    var player = this.view.getPlayerByUid(ret.uid)
    // var chip = player.addSmallChip(ret.jetton, ret.state)
    // var parent = this.view.getPlayerBetParent(player.getClientSeatId(), ret.state)
    // chip.parent = parent
    var value = player.getTotalChipValueArea(ret.state)
    player.setChipsOnArea(value + ret.jetton, ret.state)

    this.totalBetNumList[ret.state] += ret.jetton
    this.view.updateTotalBetInfo()

    this.jipaiZhuangUid = ret.banker_squeeze_permi_uid
    this.view.setBankerDelegate(ret.banker_squeeze_permi_uid)
    this.jipaiXianUid = ret.player_squeeze_permi_uid
    this.view.setXianDelegate(ret.player_squeeze_permi_uid)

    //策划说只有自己下注才需要播放音效
    if (ret.uid == gUserData.uid) {
      cc.musicMgr.playEffect("bet.mp3")
    }
  },

  settle: function (ret, isMiddle) {
    for (var i = 1; i <= 9; i++) {
      this.view.find("player" + i).js.chipSettle(clone(ret.state_info), isMiddle)
    }
    for (var i = 0; i < ret.user_win_list.length; i++) {
      var user_profit = ret.user_win_list[i]
      var player = this.view.getPlayerByUid(user_profit.uid)
      //如果玩家输了，不用更新数量，因为在下注的时候已经扣除了筹码
      if (user_profit.win_jetton >= 0) {
        player.updateGoldNum(user_profit.win_jetton)
      }
      //如果玩家自身这盘赢了，播放赢的音效
      if (user_profit.uid == gUserData.uid && user_profit.win_jetton > 0) {
        cc.musicMgr.playEffect("win.mp3")
      }
    }
    var owner = this.view.find("player0")
    owner.updateGoldNum(ret.owner_win_jetton)
  },

  //单局游戏结算
  on_settle_accounts_inning: function (ret) {
    this.settle(ret)
    cc.musicMgr.playResultEffect(ret)
    setTimeout(function () {
      var view = this.view.openView("prefabs/wayBill/WayBillView")
      this.wayBillView = view
      view.setData(ret.waybill_info.chess_cards_way_list)
      if (this.isRoomOwner()) {
        view.hide()
        var singleResultView = this.view.openView("prefabs/singleResult/SingleResultView")
        this.singleResultView = singleResultView
        singleResultView.setData(ret)
      } else {
        view.show()
      }
      this.setJushu(ret.inning_count)
      //重置牌局
      this.reset()
    }.bind(this), 2000)

    //这局赢的人需要播放特效
    var checkPlayerChipFallAni = function () {
      for (var i = 0; i < ret.user_win_list.length; i++) {
        var user_profit = ret.user_win_list[i]
        var player = this.view.getPlayerByUid(user_profit.uid)
        if (user_profit.win_jetton > 0) {
          player.playChipFallAni()
        }
      }
      if (ret.owner_win_jetton > 0) {
        var owner = this.view.find("player0")
        owner.playChipFallAni()
      }
    }.bind(this)
    checkPlayerChipFallAni()
    // if (ret.state_info.state_list && ret.state_info.state_list.indexOf(1) != -1) {
    //   this.view.node_quanxian_zhuang.getComponent("PowerObj").flip(checkPlayerChipFallAni)
    // }
    // if (ret.state_info.state_list && ret.state_info.state_list.indexOf(2) != -1) {
    //   this.view.node_quanxian_xian.getComponent("PowerObj").flip(checkPlayerChipFallAni)
    // }
  },

  //中途结算
  on_settle_accounts_midway: function (ret) {
    this.settle(ret, true)
  },

  //游戏总结算
  on_settle_accounts_finish: function (ret) {
      var view = this.view.openView("prefabs/totalResult/TotalResultView")
      view.setData(clone(ret))
      if (cc.gameMgr.isForbidGame) {
        view.node.active = false
      }
  },

  onRoomLeave: function (ret) {
    var seatData = this.getSeatDataByUID(ret.uid)
    var seatID = this.calSeatId(this._myData.seat, seatData.seat)
    var player = this.view.find("player" + seatID).js
    player.init(player.clientSeatId)
  },

  onRoomJoin: function (ret) {
    var seatID = this.calSeatId(this._myData.seat, ret.seat_info.seat)
    this.view.find("player" + seatID).js.setData(ret.seat_info)
    this._otherPlayerDatas.push(ret.seat_info)
    //转为数组，因为后端发来的空table转到JS是字典
    gUserData.roomInfo.seat_info_list = clone(gUserData.roomInfo.seat_info_list)
    gUserData.roomInfo.seat_info_list.push(ret.seat_info)
  },

  on_room_game_cut_cards: function (ret) {
    cc.musicMgr.playEffect("xiao_pai.mp3")
    this.view.find("cutControl").position = { x: ret.pos, y: this.view.find("cutControl").position.y }
    setTimeout(function () {
      this.view.find("cutPoker").active = false
      this.view.find("pokerDiscard").active = true
      this.view.showDiscard(ret.open_cards)
    }.bind(this), 1000)
  },

  getSeatDataByUID: function (uid) {
    for (var key in this._otherPlayerDatas) {
      if (uid == this._otherPlayerDatas[key].user_base_info.uid) {
        return this._otherPlayerDatas[key]
      }
    }
    if (uid == this._myData.user_base_info.uid) {
      return this._myData
    }
    if (uid == this._roomOwnerData.user_base_info.uid) {
      return this._roomOwnerData
    }
  },

  getPlayerInfoByUID: function (uid) {
    var info = this.getSeatDataByUID(uid)
    return info.user_base_info
  },

  setRoomOwner: function (ownerSeatData) {
    this._roomOwnerData = ownerSeatData
    if (ownerSeatData.user_base_info.uid == gUserData.uid) {
      this._isRoomOwner = true
    }
    else {
      this._isRoomOwner = false
    }
    this.view.find("player0").js.setData(ownerSeatData)
  },

  isRoomOwner: function () {
    return this._isRoomOwner
  },

  //计算UI上的座位ID
  calSeatId: function (myId, otherId) {
    var ownerOffset = 0
    if (!this.isRoomOwner()) {
      ownerOffset = 1
    }
    var offset = otherId - myId
    if (offset < 0) {

      return offset + 9 + ownerOffset
    }
    else {
      return offset + ownerOffset
    }
  },

  //设置玩家数据
  setPlayerDatas: function (playerDatas) {
    this._otherPlayerDatas = playerDatas
    if (!this.isRoomOwner()) {
      for (var i = 0; i < tableNums(playerDatas); i++) {
        if (gUserData.uid == playerDatas[i].user_base_info.uid) {
          this._myData = playerDatas[i]
          removeByIndex(playerDatas, i)
          break
        }
      }
      // this.view.playerList[1].getComponent("Player").setData(this._myData)
      this.view.find("player1").js.setData(this._myData)
    }
    else {
      this._myData = this._roomOwnerData
    }

    //显示其他玩家的UI
    for (var i = 0; i < tableNums(playerDatas); i++) {
      var seatData = playerDatas[i]
      var seatID = this.calSeatId(this._myData.seat, seatData.seat)
      // this.view.playerList[seatID].getComponent("Player").setData(seatData)
      this.view.find("player" + seatID).js.setData(seatData)
    }
  },

  reqRoomLeave: function () {
    cc.netMgr.request("room_leave", {}, function (ret) {
      cc.netMgr.exec(ret, function () {
        // cc.common.showMsgBox({ type: 1, msg: "已离开房间" })
        cc.gameMgr.backToLobbyScene()
      })
    })
  },

  reqRoomClose: function () {
    cc.netMgr.request("room_close_launch", {}, function (ret) {
      cc.netMgr.exec(ret, function () {
      })
    })
  },

  reqStartGame: function () {
    cc.netMgr.request("room_game_start", {}, function (ret) {
      cc.netMgr.exec(ret, function () {
        // gUserData.roomInfo.room_status = "start"
      })
    })
  },
  //切牌
  reqCutCards: function (data) {
    cc.netMgr.request("room_game_cut_cards", data, function (ret) {
      cc.netMgr.exec(ret, function () {
      })
    })
  },

  //下注
  reqBet: function (data) {
    cc.netMgr.request("room_game_betting", data, function (ret) {
      cc.netMgr.exec(ret, function () {
      })
    })
  },

  //清除下注
  reqClearBet: function () {
    cc.netMgr.request("room_game_clear_bet", {}, function (ret) {
      cc.netMgr.exec(ret, function () {
      })
    })
  },

  //停止下注
  reqStopBet: function () {
    cc.netMgr.request("room_game_stop_bet", {}, function (ret) {
      cc.netMgr.exec(ret, function () {
      })
    })
  },

  //处理刚进入房间或者重连时候的房间数据 重点：1筹码状况 2卡牌状况 3挤牌权 4路单
  handleRoomInfo: function () {
    //设置时间差
    var curTime = Date.parse(new Date()) / 1000
    this.curStateTime = gUserData.roomInfo.game_status_begin_time
    // cc.log("设置时间差 srvTime, curStateTime, curTime", gUserData.roomInfo.srv_curr_time, this.curStateTime, curTime)
    timeOffset = curTime - gUserData.roomInfo.srv_curr_time

    this.onGameStateChanged({ status: gUserData.roomInfo.game_status, game_status_begin_time: gUserData.roomInfo.game_status_begin_time })
    var room_close_info = gUserData.roomInfo.room_close_info
    if (room_close_info.launch_time != 0) {
      var view = this.view.openView("prefabs/dismissRoom/DismissRoomView")
      view.setData(room_close_info)
    }

    this.totalBetNumList[1] = gUserData.roomInfo.total_bet_banker
    this.totalBetNumList[2] = gUserData.roomInfo.total_bet_player
    this.totalBetNumList[3] = gUserData.roomInfo.total_bet_tie
    this.totalBetNumList[4] = gUserData.roomInfo.total_bet_banker_pair
    this.totalBetNumList[5] = gUserData.roomInfo.total_bet_player_pair
    this.view.updateTotalBetInfo()

    //设置挤牌权
    // if (0 != gUserData.roomInfo.banker_squeeze_permi_uid) {
    this.jipaiZhuangUid = gUserData.roomInfo.banker_squeeze_permi_uid
    this.view.setBankerDelegate(this.jipaiZhuangUid)
    // }
    // if (0 != gUserData.roomInfo.player_squeeze_permi_uid) {
    this.jipaiXianUid = gUserData.roomInfo.player_squeeze_permi_uid
    this.view.setXianDelegate(this.jipaiXianUid)
    // }

    //设置闲方的牌
    var buPai_xian = false
    var playerCardsList = []
    playerCardsList.push(0) //这么做是为了以1开始的索引，因为后端其他数据会发以1开始的索引
    for (var i = 0; i < gUserData.roomInfo.player_cards_list.length; i++) {
      var cards = gUserData.roomInfo.player_cards_list[i]
      playerCardsList.push(clone(cards))
    }
    for (var i = 1; i < playerCardsList.length; i++) {
      var data = playerCardsList[i]
      var clientIndex = clientCardIndex[2][i]
      var card = this.view.cardList[clientIndex]
      card.js.setData(data, clientIndex)
      card.active = true
      card.js.showBack()
      // card.position = this.view.find("posCard" + clientIndex).position
      if(playerCardsList.length == 4){
        card.position = this.view.find("dieposCard" + clientIndex).node.position
        buPai_xian = true
      }
      else{
        card.position = this.view.find("posCard" + clientIndex).node.position
      }
    }
    //闲方已打开的牌
    for (var i = 0; i < gUserData.roomInfo.player_open_cards_list.length; i++) {
      var serverIndex = gUserData.roomInfo.player_open_cards_list[i]
      var index = clientCardIndex[2][serverIndex]
      var card = this.view.cardList[index]
      card.js.squeezeComplete(buPai_xian)
    }

    //设置庄家的牌
    var bankerCardsList = []
    var buPai_zhuang = false
    bankerCardsList.push(0) //这么做是为了以1开始的索引，因为后端其他数据会发以1开始的索引
    for (var i = 0; i < gUserData.roomInfo.banker_cards_list.length; i++) {
      var cards = gUserData.roomInfo.banker_cards_list[i]
      bankerCardsList.push(clone(cards))
    }
    for (var i = 1; i < bankerCardsList.length; i++) {
      var data = bankerCardsList[i]
      var clientIndex = clientCardIndex[1][i]
      var card = this.view.cardList[clientIndex]
      card.js.setData(data, clientIndex)
      card.active = true
      card.js.showBack()
      // card.position = this.view.find("posCard" + clientIndex).position
      if (bankerCardsList.length == 4) {
        card.position = this.view.find("dieposCard" + clientIndex).node.position
        buPai_zhuang = true
      }
      else{
        card.position = this.view.find("posCard" + clientIndex).node.position
      }
    }
    //庄家已打开的牌
    for (var i = 0; i < gUserData.roomInfo.banker_open_cards_list.length; i++) {
      var serverIndex = gUserData.roomInfo.banker_open_cards_list[i]
      var index = clientCardIndex[1][serverIndex]
      var card = this.view.cardList[index]
      card.js.squeezeComplete(buPai_zhuang)
    }

    //挤牌阶段
    if (stateEnmu.SQUEEZE_CARDS == gUserData.roomInfo.game_status) {
      this.on_room_game_squeeze_cards_square({ state: gUserData.roomInfo.curr_squeeze_cards_square, unopen_cards_list: gUserData.roomInfo.unopen_cards_list })
    }
  },

  //转移挤牌权
  reqTransCardPermisssion: function (data) {
    cc.netMgr.request("room_game_trans_permi", data, function (ret) {
      //转移挤牌权失败，挤牌权回去原玩家身上
      if (ret.code != Code.OK) {
        if (this.jipaiZhuangUid) {
          var player = this.view.getPlayerByUid(this.jipaiZhuangUid)
          this.view.find("node_quanxian_zhuang").move(player.node.position)
        }
        if (this.jipaiXianUid) {
          var player = this.view.getPlayerByUid(this.jipaiXianUid)
          this.view.find("node_quanxian_xian").move(player.node.position)
        }
      }
      cc.netMgr.exec(ret, function () {
      })
    }.bind(this))
  },

  on_room_game_trans_permi: function (ret) {
    // cc.log("转让挤牌权", ret.banker_squeeze_permi_uid, ret.player_squeeze_permi_uid)
    this.jipaiZhuangUid = ret.banker_squeeze_permi_uid
    this.view.setBankerDelegate(ret.banker_squeeze_permi_uid)
    this.jipaiXianUid = ret.player_squeeze_permi_uid
    this.view.setXianDelegate(ret.player_squeeze_permi_uid)

    this.showPowerObjTimer()
  },

  showPowerObjTimer: function () {
    //有挤牌权的人显示倒计时
    for (var i = 1; i <= 9; i++) {
      var player = this.view.find("player" + i)
      if (player.data) {
        player.pb_timer.active = false
      }
    }
    if (this.jipaiZhuangUid) {
      this.view.getPlayerByUid(this.jipaiZhuangUid).pb_timer.active = true
    }
    if (this.jipaiXianUid) {
      this.view.getPlayerByUid(this.jipaiXianUid).pb_timer.active = true
    }
    //自己有挤牌权显示提示
    if (this.jipaiZhuangUid == cc.gameMgr._myData.user_base_info.uid || this.jipaiXianUid == cc.gameMgr._myData.user_base_info.uid) {
      this.view.find("player1").showMoveFirstTips()
    }
  },

  on_room_chat: function (ret) {
    var player = this.view.getPlayerByUid(ret.uid)
    player.showBubble({ type: ret.type, words: ret.words })
  },

  setJushu: function (num) {
    this.curJushu = num
    var totalJushu = 0
    // if (1 == gUserData.roomInfo.room_setup_info.inning_limit_type) {
    //   totalJushu = 20
    // }
    // else if (2 == gUserData.roomInfo.room_setup_info.inning_limit_type) {
    //   totalJushu = 50
    // }
    // else if (3 == gUserData.roomInfo.room_setup_info.inning_limit_type) {
    //   totalJushu = 80
    // }
    totalJushu = gUserData.roomInfo.room_setup_info.inning_num
    this.view.find("txtJushu").string = "局数：" + num + "/" + totalJushu
  },

  on_room_game_clear_bet: function (ret) {
    var player = this.view.getPlayerByUid(ret.uid)
    player.clearAllSmallChip()

    this.jipaiZhuangUid = ret.banker_squeeze_permi_uid
    this.view.setBankerDelegate(ret.banker_squeeze_permi_uid)
    this.jipaiXianUid = ret.player_squeeze_permi_uid
    this.view.setXianDelegate(ret.player_squeeze_permi_uid)
  },

  //获取挤牌类型
  getSqueezeType: function () {
    //浏览器暂不支持3D挤牌
    if (cc.sys.isBrowser) {
      return squeezeType.slider
    }
    else {
      return gUserData.roomInfo.room_setup_info.squeeze_cards
    }
  },

  //切牌杆位置同步
  on_room_game_cut_cards_pos: function (ret) {
    this.view.setCutControlPos(ret.pos)
  },

  backToLobbyScene: function () {
    cc.audioEngine.stopAll()
    cc.director.loadScene("LobbyScene")
  },

  //检查是否有延时挤牌要处理
  checkDelaySqueeze: function () {
    if (!this.view.isExitOneCardOnMove() && this.delaySqueezeData) {
      this.on_room_game_squeeze_cards_square(this.delaySqueezeData)
      this.delaySqueezeData = null
    }

  },

});

//后端下注类型转客户端数据
var clientBetState = {}
clientBetState[1] = "zhuang"
clientBetState[2] = "xian"
clientBetState[3] = "he"
clientBetState[4] = "zhuangdui"
clientBetState[5] = "xiandui"

//后端的牌索引转客户端牌索引
var clientCardIndex = {}
clientCardIndex[1] = {} //庄
clientCardIndex[2] = {} //闲
clientCardIndex[2][1] = 1
clientCardIndex[2][2] = 2
clientCardIndex[2][3] = 5
clientCardIndex[1][1] = 3
clientCardIndex[1][2] = 4
clientCardIndex[1][3] = 6

//游戏阶段
var stateEnmu = {
    CUT_CARDS : 1,                  // 切牌
    BETTING : 2,                    // 下注
    BETTING_DELAY : 3,              // 下注延迟
    TRANS_PERMI : 4,                // 转让挤牌权
    SEND_CARDS : 5,                 // 发牌
    SQUEEZE_CARDS : 6,              // 挤牌
    MEND_CARDS : 7,                 // 补牌
    COMPARE_CARDS : 8,              // 比牌
    SETTLE_ACCOUNTS_INNING : 9,     // 单局结算
    SETTLE_ACCOUNTS_FINISH : 10,    // 最终结算
    SETTLE_ACCOUNTS_MIDWAY : 11,    // 中途结算
}

var timeConfig = {
    CUT_CARDS_TIME_LIMIT : 10,                        //切牌超时时间限制
    BETTING_TIME_LIMIT : 15,                          //下注超时时间限制
    BETTING_DELAY_TIME_LIMIT : 15,                    //下注延迟超时时间限制
    TRANS_PERMI_TIME_LIMIT : 5,                      //转移挤牌权超时时间限制
    SEND_CARDS_TIME_LIMIT : 5,                       //发牌超时时间限制
    SQUEEZE_CARDS_TIME_LIMIT : 15,                    //挤牌超时时间限制
    COMPARE_CARDS_TIME_LIMIT : 5,                    //比牌超时时间限制
    MEND_CARDS_TIME_LIMIT : 3,                       //补牌超时时间限制
    SETTLE_ACCOUNTS_INNING_TIME_LIMIT : 3,           //牌局结算超时时间限制
    SETTLE_ACCOUNTS_FINISH_TIME_LIMIT : 3,           //游戏结算超时时间限制
    SETTLE_ACCOUNTS_MIDWAY_TIME_LIMIT : 3,           //中途结算超时时间限制
}

module.exports = {
    clientBetState:clientBetState,
    clientCardIndex:clientCardIndex,
    stateEnmu:stateEnmu,
    timeConfig:timeConfig,
}

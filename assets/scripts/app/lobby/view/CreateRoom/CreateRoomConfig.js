// 房间配置
var ruleMap = []
ruleMap["toggle1<Toggle>"] = "20局"
ruleMap["toggle2<Toggle>"] = "50局"
ruleMap["toggle3<Toggle>"] = "80局"
ruleMap["toggle4<Toggle>"] = "允许途中加入"
ruleMap["toggle5<Toggle>"] = "翻动挤牌"
ruleMap["toggle6<Toggle>"] = "滑动挤牌"
ruleMap["toggle7<Toggle>"] = "1-1千"
ruleMap["toggle8<Toggle>"] = "10-1W"

var roomParams = {}
roomParams["jushu"] = {"toggle1<Toggle>":1, "toggle2<Toggle>":2, "toggle3<Toggle>":3}
roomParams["yazhu"] = {"toggle7<Toggle>":1, "toggle8<Toggle>":2}
roomParams["jipai"] = {"toggle5<Toggle>":1, "toggle6<Toggle>":2}
roomParams["jiaru"] = {"toggle4<Toggle>":1}

module.exports = {
    ruleMap:ruleMap,
    roomParams:roomParams,
}

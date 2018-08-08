cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    ctor: function () {
        this.eventMap = {}
    },

    addEvent: function (name, cb, obj) {
        var arr = this.eventMap[name]
        if (null == arr) {
            arr = []
            this.eventMap[name] = arr
        }
        arr.push({name : name, cb : cb, obj : obj})
    },

    removeEvent: function (name, cb) {
        var arr = this.eventMap[name]
        if (null == arr) {
            return
        }
        for (var key in arr) {
            var v = arr[key]
            if (cb == v.cb) {
                // delete arr[key]
                arr.splice(key, 1)
                return
            }
        }
    },

    emit: function (name, data) {
        var arr = this.eventMap[name]
        // cc.log("...", arr)
        if (null == arr) {
            return
        }
        for (var key in arr) {
            var v = arr[key]
            // v.cb(data)
            v.cb.call(v.obj, data);
        }
    },

});

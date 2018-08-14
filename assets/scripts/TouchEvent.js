cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    
    _callback: null,

    // use this for initialization
    onLoad: function () {
        var self = this
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (this._callback) {
                this._callback();
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (touch) {
            var pos = self.node.parent.convertTouchToNodeSpaceAR(touch)
            if (pos.x <= 240 && pos.x >= -240) {
                this.node.position = {x : pos.x, y: this.node.position.y}
            }
            
            cc.log("111", touch, pos)
            if (this._callback) {
                this._callback();
            }
        }, this);
    },
});

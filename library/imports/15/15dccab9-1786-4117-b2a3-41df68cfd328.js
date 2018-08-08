"use strict";
cc._RF.push(module, '15dccq5F4ZBF7KjQd9oz9Mo', 'BaseObj');
// scripts/common/base/BaseObj.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this.uiContainer = {};
        this.bindUiNode();
        this.bindJs();
        if (this.node.onLoadCb) {
            this.node.onLoadCb(this);
        }
    },

    //绑定脚本，绑定第一个组件类名不是cc.开头的组件。prefab.js引用脚本
    bindJs: function bindJs() {
        for (var k in this.node._components) {
            var v = this.node._components[k];
            if (-1 == v.__classname__.indexOf("cc")) {
                this.node.js = v;
                return;
            }
        }
    },

    //绑定UI节点,可以通过this.节点名称访问UI编辑器上的节点。如果是在编辑器里生成的预制节点，则需要通过this.node访问。
    bindUiNode: function bindUiNode() {
        // cc.log("BaseObj:", this)
        // this.recurBindUiNode(this.node, this.uiContainer)
        this.recurBindUiNode(this.node, this);
    },

    recurBindUiNode: function recurBindUiNode(node, parentObj) {
        if (0 == node._children.length) {
            //如果没有孩子且挂载的组件只有一个，则索引这个组件，可以通过._parent索引到这个组件挂载的节点上。
            if (1 == node._components.length) {
                parentObj[node._name] = node._components[0];
            } else {
                parentObj[node._name] = node;
            }
        } else {
            var obj;
            // if ("Canvas" == node._name || node._prefab) {
            if ("Canvas" == node._name) {
                obj = parentObj;
                for (var k in node._components) {
                    // cc.log("zzzz", k, node._components[k], node._components[k].__classname__)
                }
            } else {
                // obj = parentObj[node._name] || {}
                obj = parentObj[node._name] || node;
                parentObj[node._name] = obj;
            }
            for (var k in node._children) {
                var v = node._children[k];
                this.recurBindUiNode(v, obj);
            }
        }
    },

    //找出节点，如果节点有且只有一个组件且没有孩子，则返回这个组件。注意这个函数返回的是creator框架本身的节点而不是上面绑定UI的节点的引用。
    //如果节点有孩子，只挂载了一个组件，而且是脚本，则返回这个脚本。
    find: function find(name) {
        // function recurFind(name, dict) {
        //     for (var k in dict) {
        //         if (name == k) {
        //             return dict[k]
        //         } else {
        //             return recurFind(name, dict[k])
        //         }
        //     }
        // }
        // return recurFind(name, this.uiContainer)

        // var ret = cc.find(name, this.node) //cc.find有BUG
        // cc.log("???", ret)
        // if (1 == ret._components.length) {
        //     return ret._components[0]
        // } else {
        //     return ret
        // }

        //组件是否JS脚本
        function isCompoentJs(compoent) {
            return -1 == compoent.__classname__.indexOf("cc");
        }

        function recurFind(name, parent) {
            if (!parent) {
                return null;
            }
            for (var k in parent._children) {
                var v = parent._children[k];
                if (name == v._name) {
                    if (1 == v._components.length && 0 == v._children.length || 1 == v._components.length && isCompoentJs(v._components[0])) {
                        return v._components[0];
                    } else {
                        return v;
                    }
                } else {
                    var ret = recurFind(name, v);
                    if (ret) {
                        return ret;
                    }
                }
            }
            return null;
        }
        return recurFind(name, this.node);
    },

    getNameStringCount: function getNameStringCount(str, limit) {
        var strLength = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                strLength += 2;
            } else {
                strLength++;
            }
            if (limit && limit <= strLength) {
                return i + 1;
            }
        }
        return strLength;
    }
});

cc._RF.pop();
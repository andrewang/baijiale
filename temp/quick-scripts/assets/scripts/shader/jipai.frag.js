(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/shader/jipai.frag.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7b8cfYfEwBFZ7nGFfkw8rH7', 'jipai.frag', __filename);
// scripts/shader/jipai.frag.js

"use strict";

module.exports = "\nvarying vec2 v_texCoord;\nvoid main()\n{\n    gl_FragColor = texture2D(CC_Texture0, v_texCoord);\n}\n\n";

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
        //# sourceMappingURL=jipai.frag.js.map
        
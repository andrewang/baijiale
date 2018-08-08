(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/shader/end.vert.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '15dc0r2fVZAxo8i2ttqDf1c', 'end.vert', __filename);
// scripts/shader/end.vert.js

"use strict";

module.exports = "\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform float width;\nuniform float height;\nuniform float offx;\nuniform float offy;\nuniform float rotation;\nvarying vec2 v_texCoord;\n\nvoid main()\n {\n    vec4 tmp_pos = vec4(0.0, 0.0, 0.0, 0.0);\n    tmp_pos = vec4(a_position.x, a_position.y, 0.0, 1.0);\n    // tmp_pos = vec4(a_position.y, width-a_position.x, 0.0, 1.0);\n    // if (0.0 <= rotation && rotation < 90.0) {\n    //     tmp_pos = vec4(a_position.x, a_position.y, 0.0, 1.0);\n    // }\n    // else if (90.0 == rotation) {\n    //     tmp_pos = vec4(a_position.y, width-a_position.x, 0.0, 1.0);\n    // }\n    //  if(tmp_pos.x < 0.0 || tmp_pos.x > width || tmp_pos.y < 0.0 || tmp_pos.y > height){\n    //  tmp_pos.x = 0.0;tmp_pos.y = 0.0;}\n     tmp_pos += vec4(offx, offy, 0.0, 0.0);\n     gl_Position = CC_MVPMatrix * tmp_pos;\n     v_texCoord = vec2(a_texCoord.x, 1.0-a_texCoord.y);\n}\n";

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
        //# sourceMappingURL=end.vert.js.map
        
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/shader/smooth.vert.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '32dc2eRH3FAGKDVno57OK4q', 'smooth.vert', __filename);
// scripts/shader/smooth.vert.js

"use strict";

module.exports = "\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform float width;\nuniform float height;\nuniform float offx;\nuniform float offy;\nuniform float rotation;\nvarying vec2 v_texCoord;\n\nvoid main()\n{\n    vec4 tmp_pos = vec4(0.0, 0.0, 0.0, 0.0);\n    tmp_pos = vec4(a_position.x, a_position.y, 0.0, 1.0);\n     if(tmp_pos.x < 0.0 || tmp_pos.x > width || tmp_pos.y < 0.0 || tmp_pos.y > height){\n     tmp_pos.x = 0.0;tmp_pos.y = 0.0;}\n     float cl = height/5.0;\n     float sl = (height - cl)/2.0;\n     float radii = (cl/rotation)/2.0;\n     float sinRot = sin(rotation);\n     float cosRot = cos(rotation);\n     float distance = radii*sinRot;\n     float centerY = height/2.0;\n     float poxY1 = centerY - distance;\n     float poxY2 = centerY + distance;\n     float posZ = sl*sinRot;\n     if(tmp_pos.y <= sl){\n        float length = sl - tmp_pos.y;\n        tmp_pos.y = poxY1 - length*cosRot;\n        tmp_pos.z = posZ - length*sinRot;\n     }\n     else if(tmp_pos.y < (sl+cl)){\n        float el = tmp_pos.y - sl;\n        float rotation2 = -el/radii;\n        float x1 = poxY1;\n        float y1 = posZ;\n        float x2 = centerY;\n        float y2 = posZ - radii*cosRot;\n        float sinRot2 = sin(rotation2);\n        float cosRot2 = cos(rotation2);\n        tmp_pos.y=(x1-x2)*cosRot2-(y1-y2)*sinRot2+x2;\n        tmp_pos.z=(y1-y2)*cosRot2+(x1-x2)*sinRot2+y2;\n     }\n     else if(tmp_pos.y <= height){\n         float length = tmp_pos.y - cl - sl;\n         tmp_pos.y = poxY2 + length*cosRot;\n         tmp_pos.z = posZ - length*sinRot;\n     }\n     tmp_pos += vec4(offx, offy, 0.0, 0.0);\n     gl_Position = CC_MVPMatrix * tmp_pos;\n     v_texCoord = vec2(1.0-a_texCoord.x, 1.0-a_texCoord.y);\n}\n\n";

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
        //# sourceMappingURL=smooth.vert.js.map
        
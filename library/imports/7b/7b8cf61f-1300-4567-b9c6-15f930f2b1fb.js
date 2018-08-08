"use strict";
cc._RF.push(module, '7b8cfYfEwBFZ7nGFfkw8rH7', 'jipai.frag');
// scripts/shader/jipai.frag.js

"use strict";

module.exports = "\nvarying vec2 v_texCoord;\nvoid main()\n{\n    gl_FragColor = texture2D(CC_Texture0, v_texCoord);\n}\n\n";

cc._RF.pop();
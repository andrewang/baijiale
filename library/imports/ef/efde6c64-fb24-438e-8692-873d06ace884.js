"use strict";
cc._RF.push(module, 'efde6xk+yRDjoaShz0GrOiE', 'ANT_gray.vert');
// common/sharder/ANT_gray.vert.js

"use strict";

// gray.vert.js
module.exports = "\nattribute vec4 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\nvarying vec4 v_fragmentColor; \nvarying vec2 v_texCoord; \nvoid main() \n{ \n    gl_Position = CC_PMatrix * a_position;\n    v_fragmentColor = a_color; \n    v_texCoord = a_texCoord; \n}\n";

cc._RF.pop();
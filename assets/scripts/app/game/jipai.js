// var jipai_vert = require("jipai.vert");
// var jipai_frag = require("jipai.frag");

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         szBack : cc.SpriteFrame,
//         szFont : cc.SpriteFrame,
//     },

//     onLoad: function () {

//         //this._use();
//         var scale = 1.0
//         //创建牌的背面
//         // var ret1 = this.getTextureAndRange(this.szBack)
//         // var id1 = ret1[0]
//         // var texRange1 = ret1[1]
//         // var sz1 = ret1[2]
//         // ret1 = this.initCardVertex(cc.size(sz1[0] * scale, sz1[1] * scale), texRange1, true)
//         // var msh1 = ret1[0]
//         // var nVerts1 = ret1[1]
//         // //创建牌的正面
//         // var ret2 = this.getTextureAndRange(this.szFont)
//         // var id2 = ret2[0]
//         // var texRange2 = ret2[1]
//         // var sz2 = ret2[2]
//         // ret2 = this.initCardVertex(cc.size(sz2[0] * scale, sz2[1] * scale), texRange2, false)
//         // var msh2 = ret2[0]
//         // var nVerts2 = ret2[1]
        
//         //搓牌的程度控制， 搓牌类似于通过一个圆柱滚动将牌粘着起来的效果。下面的参数就是滚动程度和圆柱半径
//         // this._uniRatio = 0.0
//         // this._uniRadius = sz1[0] * scale / math.pi;
//     },

//     _use: function () {
//         this._program = new cc.GLProgram()
//         this._program.initWithString(jipai_vert, jipai_frag)
//         this._program.link()
//         this._program.updateUniforms()

//         if (cc.sys.isNative) {
//             cc.log("use native GLProgram")
//             // this._program.initWithString(_default_vert_no_mvp, _wave_v_frag);
//             // this._program.link();
//             // this._program.updateUniforms();
//         } else {
//             this._program.initWithVertexShaderByteArray(jipai_vert, jipai_frag);
//             this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
//             this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
//             this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
//             this._program.link()
//             this._program.updateUniforms()
//         }

//         this._uniRatio = this._program.getUniformLocationForName("ratio");
//         this._uniRadius = this._program.getUniformLocationForName("radius");


//         // if (cc.sys.isNative) {
//         //     var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
//         //     glProgram_state.setUniformFloat( this._uniRadius, this._radius );
//         //     glProgram_state.setUniformFloat( this._uniRatio, this._ratio );
//         //     glProgram_state.setUniformFloat( this._uniWidth, this._width );
//         // }else{
//         //     this._program.setUniformLocationWith1f( this._uniRadius, this._radius );
//         //     this._program.setUniformLocationWith1f( this._uniRatio, this._ratio );
//         //     this._program.setUniformLocationWith1f( this._uniWidth, this._width );
//         // }

//         this.setProgram(this.node._sgNode, this._program);
//     },
//     setProgram: function (node, program) {
//         if (cc.sys.isNative) {
//             var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
//             node.setGLProgramState(glProgram_state);
//         } else {
//             node.setShaderProgram(program);
//         }

//         var children = node.children;
//         if (!children)
//             return;

//         for (var i = 0; i < children.length; i++)
//             this.setProgram(children[i], program);
//     },

//     update: function (dt) {
//         if (this._program) {
//             this._program.use();
//             if (cc.sys.isNative) {
//                 var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
//                 glProgram_state.setUniformFloat(this._uniRadius, this._radius);
//                 glProgram_state.setUniformFloat(this._uniRatio, this._ratio);
//                 glProgram_state.setUniformFloat(this._uniWidth, this._width);
//             } else {
//                 this._program.setUniformLocationWith1f(this._uniRadius, this._radius);
//                 this._program.setUniformLocationWith1f(this._uniRatio, this._ratio);
//                 this._program.setUniformLocationWith1f(this._uniWidth, this._width);
//                 this._program.updateUniforms();
//             }
//         }
//     },

//     //通过图片取得纹理id，和该纹理在plist图中的纹理坐标范围
//     getTextureAndRange: function (spriteFrame) {
//         var tex = spriteFrame.getTexture()
//         var id = tex.getName() //纹理ID

//         //左右上下的纹理范围
//         return [id, [0, 1, 0, 1], [tex.getContentSize().width, tex.getContentSize().height]]
//     },

//     initCardVertex: function (size, texRange, bFront) {
//         var nDiv = 200 //将宽分成100份

//         var verts = [] //位置坐标
//         var texs = [] //纹理坐标
//         var dh = size.height / nDiv
//         var dw = size.width

//         //计算顶点位置
//         for (var c = 0; c < nDiv; c++) {
//             var x = 0
//             var y = (c - 1) * dh
//             var quad = []
//             if (bFront) {
//                 quad = [x, y, x + dw, y, x, y + dh, x + dw, y, x + dw, y + dh, x, y + dh]
//             } else {
//                 quad = [x, y, x, y + dh, x + dw, y, x + dw, y, x, y + dh, x + dw, y + dh]
//             }
//             for (var i = 0; i < quad.length; i++) {
//                 var v = quad[i]
//                 verts.push(v)
//             }
//         }

//         var bXTex = true //是否当前在计算横坐标纹理坐标，
//         for (var i = 0; i < verts.length; i++) {
//             if (bXTex) {
//                 if (bFront) {
//                     texs.push(texs, v / size.width * (texRange[1] - texRange[0]) + texRange[0])
//                 } else {
//                     texs.push(texs, v / size.width * (texRange[0] - texRange[1]) + texRange[1])
//                 }
//             } else {
//                 if (bFront) {
//                     texs.push(texs, (1 - v / size.height) * (texRange[3] - texRange[2]) + texRange[2])
//                 } else {
//                     texs.push(texs, v / size.height * (texRange[2] - texRange[3]) + texRange[3])
//                 }
//             }
//             bXTex = !bXTex
//         }

//         var res = []
//         var tmp = [verts, texs]
//         for (var i = 0; i < tmp.length; i++) {
//             var v = tmp[i];
//             var buffid = gl.createBuffer()
//             gl.bindBuffer(gl.ARRAY_BUFFER, buffid)
//             gl.bufferData(gl.ARRAY_BUFFER, tableNums(v), v, gl.STATIC_DRAW)
//             gl.bindBuffer(gl.ARRAY_BUFFER, 0)
//             res.push(buffid)
//         }
//         return [res, tableNums(verts)]
//     },

// });

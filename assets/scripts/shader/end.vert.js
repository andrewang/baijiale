module.exports =
`
attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform float width;
uniform float height;
uniform float offx;
uniform float offy;
uniform float rotation;
varying vec2 v_texCoord;

void main()
 {
    vec4 tmp_pos = vec4(0.0, 0.0, 0.0, 0.0);
    tmp_pos = vec4(a_position.x, a_position.y, 0.0, 1.0);
    // tmp_pos = vec4(a_position.y, width-a_position.x, 0.0, 1.0);
    // if (0.0 <= rotation && rotation < 90.0) {
    //     tmp_pos = vec4(a_position.x, a_position.y, 0.0, 1.0);
    // }
    // else if (90.0 == rotation) {
    //     tmp_pos = vec4(a_position.y, width-a_position.x, 0.0, 1.0);
    // }
    //  if(tmp_pos.x < 0.0 || tmp_pos.x > width || tmp_pos.y < 0.0 || tmp_pos.y > height){
    //  tmp_pos.x = 0.0;tmp_pos.y = 0.0;}
     tmp_pos += vec4(offx, offy, 0.0, 0.0);
     gl_Position = CC_MVPMatrix * tmp_pos;
     v_texCoord = vec2(a_texCoord.x, 1.0-a_texCoord.y);
}
` 


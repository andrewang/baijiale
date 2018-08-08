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
     if(tmp_pos.x < 0.0 || tmp_pos.x > width || tmp_pos.y < 0.0 || tmp_pos.y > height){
     tmp_pos.x = 0.0;tmp_pos.y = 0.0;}
     float cl = height/5.0;
     float sl = (height - cl)/2.0;
     float radii = (cl/rotation)/2.0;
     float sinRot = sin(rotation);
     float cosRot = cos(rotation);
     float distance = radii*sinRot;
     float centerY = height/2.0;
     float poxY1 = centerY - distance;
     float poxY2 = centerY + distance;
     float posZ = sl*sinRot;
     if(tmp_pos.y <= sl){
        float length = sl - tmp_pos.y;
        tmp_pos.y = poxY1 - length*cosRot;
        tmp_pos.z = posZ - length*sinRot;
     }
     else if(tmp_pos.y < (sl+cl)){
        float el = tmp_pos.y - sl;
        float rotation2 = -el/radii;
        float x1 = poxY1;
        float y1 = posZ;
        float x2 = centerY;
        float y2 = posZ - radii*cosRot;
        float sinRot2 = sin(rotation2);
        float cosRot2 = cos(rotation2);
        tmp_pos.y=(x1-x2)*cosRot2-(y1-y2)*sinRot2+x2;
        tmp_pos.z=(y1-y2)*cosRot2+(x1-x2)*sinRot2+y2;
     }
     else if(tmp_pos.y <= height){
         float length = tmp_pos.y - cl - sl;
         tmp_pos.y = poxY2 + length*cosRot;
         tmp_pos.z = posZ - length*sinRot;
     }
     tmp_pos += vec4(offx, offy, 0.0, 0.0);
     gl_Position = CC_MVPMatrix * tmp_pos;
     v_texCoord = vec2(1.0-a_texCoord.x, 1.0-a_texCoord.y);
}

` 


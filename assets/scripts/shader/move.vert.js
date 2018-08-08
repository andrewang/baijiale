module.exports =
    `
// attribute vec2 a_position;
attribute vec4 a_position;
attribute vec2 a_texCoord;
uniform float ratio; //挤牌程度
uniform float radius;
uniform float width;
uniform float height;
uniform float rotation;

uniform float offx;
uniform float offy;
uniform float rotationLc;
varying vec2 v_texCoord;

void main()
{
    vec4 tmp_pos = vec4(0.0, 0.0, 0.0, 0.0);
    if (0.0 <= rotation && rotation < 90.0) {
        tmp_pos = vec4(a_position.x, a_position.y, 0.0, 1.0);
    }
    else if (90.0 == rotation) {
        // tmp_pos = vec4(a_position.y, width-a_position.x, 0.0, 1.0);
        tmp_pos = vec4(a_position.x, a_position.y, 0.0, 1.0);
    }
    
    float halfPeri = radius * 3.14159; //半圆的弧长（radius为半径this.pokerHeight / 10）
    float hr = height * ratio;  //挤了多少长度
    // float hr = width * ratio;  //挤了多少长度
    // float hr = 0.0;
    // if (0.0 <= rotation && rotation < 90.0) {
    //     hr = height * ratio;
    // }
    // else if (90.0 == rotation) {
    //     hr = height * ratio;
    // }
    //一开始的挤
    if(hr > 0.0 && hr <= halfPeri){
        if (0.0 <= rotation && rotation < 90.0) {
            if(tmp_pos.y < hr){
                float rad = hr/ 3.14159; //小半径（以这个长度为半圆的圆的半径）
                float arc = (hr-tmp_pos.y)/rad; //弧度,这段弧长对应的角度
                tmp_pos.y = hr - sin(arc)*rad; //斜边为半径的三角形，计算这个点所在的Y轴位置
                tmp_pos.z = rad * (1.0-cos(arc));
            }
        }
        else if (90.0 == rotation) {
            if(tmp_pos.x < hr){
                float rad = hr/ 3.14159; //小半径（以这个长度为半圆的圆的半径）
                float arc = (hr-tmp_pos.x)/rad; //弧度,这段弧长对应的角度
                tmp_pos.x = hr - sin(arc)*rad; //斜边为半径的三角形，计算这个点所在的Y轴位置
                tmp_pos.z = rad * (1.0-cos(arc));
           }
        }
    }
    //挤牌过程
    if(hr > halfPeri){
        if (0.0 <= rotation && rotation < 90.0) {
            float straight = (hr - halfPeri)/2.0; //直的部分的长度
            if(tmp_pos.y < straight){
                tmp_pos.y = hr  - tmp_pos.y;
                tmp_pos.z = radius * 2.0;
            }
            //已翻开的下面弯曲的部分
            else if(tmp_pos.y < (straight + halfPeri)) {
                float dy = halfPeri - (tmp_pos.y - straight);
                float arc = dy/radius;
                tmp_pos.y = hr - straight - sin(arc)*radius;
                tmp_pos.z = radius * (1.0-cos(arc));
            }
        }
        else if (90.0 == rotation) {
            float straight = (hr - halfPeri)/2.0; //直的部分的长度
            if(tmp_pos.x < straight){
                tmp_pos.x = hr - tmp_pos.x;
                tmp_pos.z = radius * 2.0;
            }
            //已翻开的下面弯曲的部分
            else if(tmp_pos.x < (straight + halfPeri)) {
                float dx = halfPeri - (tmp_pos.x - straight);
                float arc = dx/radius;
                tmp_pos.x = hr - straight - sin(arc)*radius;
                tmp_pos.z = radius * (1.0-cos(arc));
            }
        }
     }
     //位置偏移的
    float y1 = tmp_pos.y;
    float z1 = tmp_pos.z;
    float y2 = height;
    float z2 = 0.0;
    float sinRat = sin(rotationLc);
    float cosRat = cos(rotationLc);
    tmp_pos.y=(y1-y2)*cosRat-(z1-z2)*sinRat+y2;
    tmp_pos.z=(z1-z2)*cosRat+(y1-y2)*sinRat+z2;
    tmp_pos.y = tmp_pos.y - height/2.0*(1.0-cosRat);
    tmp_pos += vec4(offx, offy, 0.0, 0.0);

    gl_Position = CC_MVPMatrix * tmp_pos;
    v_texCoord = vec2(1.0-a_texCoord.x, 1.0-a_texCoord.y);

 }

`


precision highp float;

attribute vec2 sprite;
uniform sampler2D state;

varying vec2 rg;

void main() {
  vec2 position = texture2D(state, sprite).xy;
  gl_PointSize = 16.0;
  rg = sprite;
  gl_Position = vec4(position, 0, 1);
}
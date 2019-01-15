precision mediump float;

attribute vec2 position;
uniform vec4 view;
varying vec2 uv;

void main() {
  uv = mix(view.xw, view.zy, 0.5 * (1.0 + position));
  gl_Position = vec4(position, 1, 1);
}
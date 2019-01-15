precision highp float;

attribute vec2 p;
varying vec2 uv;

void main() {
  uv = 0.5 * (p + 1.0);
  gl_Position = vec4(p, 0, 1);
}
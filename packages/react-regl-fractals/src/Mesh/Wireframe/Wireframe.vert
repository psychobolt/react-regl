precision mediump float;

attribute vec2 position;
attribute vec2 barycentric;

varying vec2 vbc;

void main() {
  vbc = barycentric;
  gl_Position = vec4(position, 0, 1);
}
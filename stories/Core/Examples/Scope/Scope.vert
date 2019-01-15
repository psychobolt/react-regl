precision mediump float;

attribute vec2 position;
uniform vec2 offset;

void main() {
  gl_Position = vec4(position + offset, 0, 1);
}

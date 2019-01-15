precision mediump float;
uniform mat4 projection, view, model;
attribute vec3 position;

varying vec4 vPosition;

void main() {
  vec4 pos = projection * view * model * vec4(position , 1);
  vPosition = pos;
  gl_Position = pos;
}

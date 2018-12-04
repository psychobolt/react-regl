precision mediump float;

attribute vec3 position;
varying vec3 vPosition;
uniform mat4 projection, view, model;

void main() {
  vec4 p = model * vec4(position, 1.0);
  vPosition = p.xyz;
  gl_Position = projection * view * p;
}
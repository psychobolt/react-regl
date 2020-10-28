precision mediump float;

uniform mat4 projection, view;
attribute vec3 position, normal;
attribute vec2 barycentric;

varying vec3 vnormal;
varying vec2 vbc;

void main() {
  vnormal = normal;
  vbc = barycentric;
  gl_Position = projection * view * vec4(position, 1.0);
}
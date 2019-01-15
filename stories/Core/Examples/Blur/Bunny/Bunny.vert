precision mediump float;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vNormal;

uniform mat4 projection, model, view;

void main() {
  vNormal = normal;
  gl_Position = projection * view * model * vec4(position, 1.0);
}

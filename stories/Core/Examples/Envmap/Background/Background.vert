precision mediump float;

attribute vec2 position;
uniform mat4 view;
varying vec3 reflectDir;

void main() {
  reflectDir = (view * vec4(position, 1, 0)).xyz;
  gl_Position = vec4(position, 0, 1);
}
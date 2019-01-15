// the size of the world on the x and z-axes.
precision mediump float;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;

uniform mat4 projection, view, model;

void main() {
  vPosition = position;
  vNormal = normal;
  gl_Position = projection * view * model * vec4(position, 1);
}
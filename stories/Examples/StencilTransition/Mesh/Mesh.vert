precision mediump float;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;

uniform mat4 projection, view, model;

void main() {
  vec4 worldSpacePosition = model * vec4(position, 1);

  vPosition = worldSpacePosition.xyz;
  vNormal = normal;

  gl_Position = projection * view * worldSpacePosition;
}

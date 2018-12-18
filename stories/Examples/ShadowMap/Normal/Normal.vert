precision mediump float;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vShadowCoord;

uniform mat4 projection, view, model;
uniform mat4 lightProjection, lightView;

void main() {
  vPosition = position;
  vNormal = normal;

  vec4 worldSpacePosition = model * vec4(position, 1);
  gl_Position = projection * view * worldSpacePosition;
  vShadowCoord = (lightProjection * lightView * worldSpacePosition).xyz;
}

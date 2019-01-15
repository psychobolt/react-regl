precision mediump float;

uniform mat4 projection, view;
uniform mat3 normalMatrix;

attribute vec3 position, normal;

varying vec3 vNormal, v0Normal, vU;
varying vec4 vPosition, v0Position;

void main() {
  vNormal = normalMatrix * normal;
  v0Normal = normal;
  vPosition = vec4(position, 1.0);
  v0Position = view * vPosition;
  vU = normalize(vec3(v0Position));
  gl_Position = projection * v0Position;
}
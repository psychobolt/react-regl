precision highp float;

attribute vec3 position, normal;
uniform mat4 projection, view, model;
uniform vec3 eye;
varying vec3 eyeDir, fragNormal;

void main() {
  vec4 worldPos = model * vec4(position, 1);
  vec4 worldNormal = model * vec4(normal, 0);

  fragNormal = normalize(worldNormal.xyz);
  eyeDir = normalize(eye - worldPos.xyz);
  gl_Position = projection * view * worldPos;
}
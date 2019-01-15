precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform vec3 lightDir;
uniform mat4 camera;
uniform mat4 model;

varying float intensity;

void main() {
  intensity = max(-dot(lightDir, normal), 0.0);
  gl_Position = camera * model * vec4(position, 1);
}
precision mediump float;
attribute vec2 position;
uniform vec2 lightPosition;
varying vec3 lightDir, eyeDir;
varying vec2 uv;

void main() {
  vec2 P = 1.0 - 2.0 * position;
  uv = vec2(position.x, 1.0 - position.y);
  eyeDir = -vec3(P, 1);
  lightDir = vec3(lightPosition - P, 1);
  gl_Position = vec4(P, 0, 1);
}
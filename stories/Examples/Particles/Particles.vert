precision mediump float;

attribute vec4 freq, phase;
attribute vec3 color;
uniform float time;
uniform mat4 view, projection;
varying vec3 fragColor;

void main() {
  vec3 position = 8.0 * cos(freq.xyz * time + phase.xyz);
  gl_PointSize = 5.0 * (1.0 + cos(freq.w * time + phase.w));
  gl_Position = projection * view * vec4(position, 1);
  fragColor = color;
}
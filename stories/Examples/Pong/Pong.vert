precision mediump float;

attribute vec2 position;

uniform vec2 offset;
uniform vec2 scale;

uniform float viewportWidth;
uniform float viewportHeight;

void main() {
  // windows ratio scaling factor.
  float r = (viewportWidth) / (viewportHeight);
  gl_Position = vec4(position.xy * scale * vec2(1.0, r) + offset, 0, 1);
}
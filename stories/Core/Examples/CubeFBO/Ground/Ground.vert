precision highp float;

uniform mat4 projection, view;
uniform float height, tileSize;
attribute vec2 p;
varying vec2 uv;

void main() {
  uv = p * tileSize;
  gl_Position = projection * view * vec4(100.0 * p.x, height, 100.0 * p.y, 1);
}

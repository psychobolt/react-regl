precision mediump float;
attribute vec2 position;
uniform float angle;

void main() {
  gl_Position = vec4(
    cos(angle) * position.x + sin(angle) * position.y,
    -sin(angle) * position.x + cos(angle) * position.y,
    0,
    1
  );
}
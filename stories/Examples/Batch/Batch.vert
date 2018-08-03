precision mediump float;
attribute vec2 position;
uniform float angle;
uniform vec2 offset;

void main() {
  gl_Position = vec4(
    cos(angle) * position.x + sin(angle) * position.y + offset.x,
    -sin(angle) * position.x + cos(angle) * position.y + offset.y, 
    0,
    1
  );
}
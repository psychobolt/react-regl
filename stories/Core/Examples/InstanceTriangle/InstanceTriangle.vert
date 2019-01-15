precision mediump float;

attribute vec2 position;

// These three are instanced attributes.
attribute vec3 color;
attribute vec2 offset;
attribute float angle;

varying vec3 vColor;

void main() {
  gl_Position = vec4(
    +cos(angle) * position.x + sin(angle) * position.y + offset.x,
    -sin(angle) * position.x + cos(angle) * position.y + offset.y,
    0,
    1
  );
  vColor = color;
}
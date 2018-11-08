precision highp float;

attribute vec2 p;
varying vec2 id;

void main() {
  id = 0.5 * (p + 1.0);
  gl_Position = vec4(p, 0, 1);
}

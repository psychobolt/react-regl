precision mediump float;

uniform float t;

void main() {
  gl_FragColor = vec4(
    1.0 + cos(2.0 * t),
    1.0 + cos(2.1 * t + 1.0),
    1.0 + cos(2.2 * t + 2.0),
    1
  );
}

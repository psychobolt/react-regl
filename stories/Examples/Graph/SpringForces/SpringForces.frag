precision highp float;

varying vec2 force;

void main() {
  gl_FragColor = vec4(0, 0, force);
}

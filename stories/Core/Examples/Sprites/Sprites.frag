precision highp float;

varying vec2 rg;

void main() {
  gl_FragColor = vec4(rg, 1.0 - max(rg.x, rg.y), 1);
}
precision highp float;

varying vec2 uv;

void main() {
  vec2 ptile = step(0.5, fract(uv));
  gl_FragColor = vec4(abs(ptile.x - ptile.y) * vec3(1, 1, 1), 1);
}
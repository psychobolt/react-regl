precision highp float;

uniform sampler2D src;
uniform vec2 deriv;
varying vec2 uv;

void main() {
  float f01 = texture2D(src, uv - vec2(deriv.x, 0)).x;
  float f21 = texture2D(src, uv + vec2(deriv.x, 0)).x;
  float f10 = texture2D(src, uv - vec2(0, deriv.y)).x;
  float f12 = texture2D(src, uv + vec2(0, deriv.y)).x;
  gl_FragColor = vec4(f21 - f01, f12 - f10, 0, 1);
}
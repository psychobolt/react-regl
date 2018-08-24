precision mediump float;

uniform sampler2D texture;
uniform float tick;
varying vec2 uv;

void main() {
  mat3 m = mat3(
    cos(tick), sin(tick), -1.1 + cos(tick),
    -sin(tick), cos(tick), 0,
    0, 0, 1);
  vec3 p = m * vec3(uv, 1);
  gl_FragColor = texture2D(texture, p.xy / p.z);
}

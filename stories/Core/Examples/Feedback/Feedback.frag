precision mediump float;
uniform sampler2D texture;
uniform vec2 mouse;
uniform float t;
varying vec2 uv;

void main() {
  float dist = length(gl_FragCoord.xy - mouse);
  gl_FragColor = vec4(0.98 * texture2D(texture,
    uv + cos(t) * vec2(0.5 - uv.y, uv.x - 0.5) - sin(2.0 * t) * (uv - 0.5)).rgb, 1) +
    exp(-0.01 * dist) * vec4(
      1.0 + cos(2.0 * t),
      1.0 + cos(2.0 * t + 1.5),
      1.0 + cos(2.0 * t + 3.0),
      0.0);
}
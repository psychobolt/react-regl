precision mediump float;

uniform sampler2D texture;
uniform float t;
varying vec2 uv;

void main() {
  vec2 warp = uv + 0.01 * sin(t) * vec2(0.5 - uv.y, uv.x - 0.5) - 0.01 * (uv - 0.5);
  gl_FragColor = vec4(0.98 * texture2D(texture, warp).rgb, 1);
}


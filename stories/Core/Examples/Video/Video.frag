precision mediump float;

uniform sampler2D texture;
uniform vec2 screenShape;
uniform float time;

varying vec2 uv;

vec4 background() {
  vec2 pos = 0.5 - gl_FragCoord.xy / screenShape;
  float r = length(pos);
  float theta = atan(pos.y, pos.x);
  return vec4(
    cos(pos.x * time) + sin(pos.y * pos.x * time),
    cos(100.0 * r * cos(0.3 * time) + theta),
    sin(time / r + pos.x * cos(10.0 * time + 3.0)),
    1
  );
}

void main() {
  vec4 color = texture2D(texture, uv);
  float chromakey = step(0.15 + max(color.r, color.b), color.g);
  gl_FragColor = mix(color, background(), chromakey);
}

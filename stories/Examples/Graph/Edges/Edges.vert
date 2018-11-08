precision highp float;

attribute vec4 id;
attribute float arcDir;
uniform float dir;
uniform sampler2D vertexState;

void main() {
  float side = arcDir + dir - 2.0 * dir * arcDir;
  vec2 s0 = texture2D(vertexState, id.rg).xy;
  vec2 s1 = texture2D(vertexState, id.ba).xy;
  vec2 shift = mix(fract(s0) - s0, fract(s1) - s1, side);
  gl_Position = vec4(2.0 * (s0.xy + shift) - 1.0, 0, 1);
}

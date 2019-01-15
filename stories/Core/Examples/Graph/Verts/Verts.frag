precision highp float;

uniform sampler2D vertexState, field;
uniform float temperature, t, DT, DAMPING, FIELD_STRENGTH;
varying vec2 id;

float rnd(vec2 co) {
  return fract(sin(t * 0.1 + dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main () {
  vec4 state = texture2D(vertexState, id);
  vec2 p = state.rg;
  vec2 v = state.ba;
  vec2 force = texture2D(field, p).xy;
  p += DT * v;
  v = DAMPING * (v - FIELD_STRENGTH) * force;
  vec2 jitter = vec2(rnd(id), rnd(id + 1000.0)) - 0.5;
  gl_FragColor = vec4(p + temperature * jitter, v);
}
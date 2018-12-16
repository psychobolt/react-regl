precision mediump float;

uniform sampler2D tex;
varying vec2 uv;
uniform float rcpDim;

float op(float a, float b) {
  return max(a, b);
}

void main () {
  float a = texture2D(tex, uv - vec2(0.0, 0.0) * rcpDim).x;
  float b = texture2D(tex, uv - vec2(1.0, 0.0) * rcpDim).x;
  float c = texture2D(tex, uv - vec2(0.0, 1.0) * rcpDim).x;
  float d = texture2D(tex, uv - vec2(1.0, 1.0) * rcpDim).x;

  float result = op(op(a, b), op(c, d));
  gl_FragColor = vec4(result);
}

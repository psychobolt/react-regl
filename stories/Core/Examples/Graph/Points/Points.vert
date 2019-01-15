precision highp float;

attribute vec2 id;
uniform sampler2D vertexState;

void main() {
  vec4 state = texture2D(vertexState, id);
  gl_PointSize = 2.0;
  gl_Position = vec4(2.0 * fract(state.xy) - 1.0, 0, 1);
}

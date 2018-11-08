precision highp float;

attribute vec4 edge;
varying vec2 force;
uniform sampler2D vertexState;
uniform float restLength, stiffness;
uniform int VERTEX_TEXTURE_SIZE;

void main() {
  vec4 s0 = texture2D(vertexState, edge.rg);
  vec4 s1 = texture2D(vertexState, edge.ba);
  vec2 d = s1.xy - s0.xy;
  float l = max(length(d), 0.001);
  force = stiffness * log(l / restLength) * d / l;
  gl_Position = vec4(2.0 * edge.xy - 1.0 + 1.0 / float(VERTEX_TEXTURE_SIZE), 0, 1);
}
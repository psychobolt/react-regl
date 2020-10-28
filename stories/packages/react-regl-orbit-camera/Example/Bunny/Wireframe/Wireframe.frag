#extension GL_OES_standard_derivatives: enable

precision mediump float;

#pragma glslify: grid = require(glsl-solid-wireframe/barycentric/scaled)

varying vec3 vnormal;
varying vec2 vbc;

void main() {
  vec3 color = abs(vnormal);
  float shade = grid(vbc, 0.25);
  gl_FragColor = vec4(shade * color, 1.0);
}

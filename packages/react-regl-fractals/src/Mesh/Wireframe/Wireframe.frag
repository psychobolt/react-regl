#extension GL_OES_standard_derivatives: enable

precision mediump float;

#pragma glslify: grid = require(glsl-solid-wireframe/barycentric/scaled)

uniform vec4 color;
uniform vec4 wireframeColor;
uniform float lineWidth;
varying vec2 vbc;

void main() {
  float shade = grid(vbc, lineWidth);
  gl_FragColor = color * shade + (wireframeColor * (1.0 - shade));
}
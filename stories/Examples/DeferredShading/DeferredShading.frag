#extension GL_EXT_draw_buffers : require

precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 color;

void main() {
  // just output geometry data.
  gl_FragData[0] = vec4(color, 1.0);
  gl_FragData[1] = vec4(vNormal, 0.0);
  gl_FragData[2] = vec4(vPosition, 0.0);
}
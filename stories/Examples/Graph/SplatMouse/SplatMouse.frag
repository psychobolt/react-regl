precision highp float;

uniform float strength;

void main() {
  float s = strength * exp(-16.0 * dot(gl_PointCoord.xy, gl_PointCoord.xy));
  gl_FragColor = vec4(s, 0, 0, 1);
}

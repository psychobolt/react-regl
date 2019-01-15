precision highp float;

varying vec3 fragColor;

void main() {
  float lo = min(fragColor.x, min(fragColor.y, fragColor.z));
  float hi = max(fragColor.x, max(fragColor.y, fragColor.z));
  gl_FragColor = vec4((fragColor - lo) / (hi - lo), 1);
}
precision mediump float;

varying vec3 vPosition;

void main() {
  gl_FragColor = vec4(vec3(vPosition.z), 1.0);
}
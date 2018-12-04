precision mediump float;

varying vec3 vPosition;
uniform vec3 lightPos;

void main() {
  gl_FragColor = vec4(vec3(distance(vPosition, lightPos)), 1.0);
}
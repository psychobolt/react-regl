precision mediump float;

uniform vec3 diffuse;
uniform vec3 ambient;

varying float intensity;

void main() {
  gl_FragColor = vec4(diffuse * intensity + ambient, 1);
}
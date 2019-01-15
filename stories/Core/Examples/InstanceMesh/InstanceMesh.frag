precision mediump float;

varying vec3 vNormal;
varying vec3 vColor;

void main() {
  vec3 color = vColor;

  vec3 ambient = vec3(0.3) * color;

  vec3 lightDir = vec3(0.39, 0.87, 0.29);
  vec3 diffuse = vec3(0.7) * color * clamp(dot(vNormal, lightDir), 0.0, 1.0);

  gl_FragColor = vec4(ambient + diffuse, 1.0);
}

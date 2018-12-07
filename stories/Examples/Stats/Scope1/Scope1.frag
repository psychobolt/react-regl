precision mediump float;

varying vec3 vNormal;
uniform vec3 lightDir;
uniform float ambientLightAmount;
uniform float diffuseLightAmount;
uniform vec3 color;

void main() {
  vec3 tex = color;
  vec3 ambient = ambientLightAmount * tex;
  vec3 diffuse = diffuseLightAmount * tex * clamp(dot(vNormal, lightDir), 0.0, 1.0);
  gl_FragColor = vec4(ambient + diffuse, 1.0);
}
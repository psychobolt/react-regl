precision mediump float;

varying vec3 vNormal;

uniform vec3 lightDir;
uniform vec3 color;
uniform float ambientLightAmount;
uniform float diffuseLightAmount;

void main() {
  vec3 ambient = ambientLightAmount * color;
  vec3 diffuse = diffuseLightAmount * color * clamp(dot(vNormal, lightDir), 0.0, 1.0);

  gl_FragColor = vec4(ambient + diffuse, 1.0);
}

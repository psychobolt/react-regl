precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform float ambientLightAmount;
uniform float diffuseLightAmount;
uniform vec3 color;
uniform vec3 lightDir;

void main() {
  vec3 ambient = ambientLightAmount * color;
  float cosTheta = dot(vNormal, lightDir);
  vec3 diffuse = diffuseLightAmount * color * clamp(cosTheta, 0.0, 1.0);
  gl_FragColor = vec4(ambient + diffuse, 1.0);
}
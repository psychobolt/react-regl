precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D rockTexture;
uniform vec3 lightDir;
uniform float ambientLightAmount;
uniform float diffuseLightAmount;

void main() {
  vec3 tex = texture2D(rockTexture, vUv * 2.0).rgb;

  vec3 ambient = ambientLightAmount * tex;
  vec3 diffuse = diffuseLightAmount * tex * clamp(dot(vNormal, lightDir), 0.0, 1.0);

  gl_FragColor = vec4(ambient + diffuse, 1.0);
}

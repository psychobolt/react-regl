precision mediump float;

varying vec2 uv;
varying vec4 vPosition;

uniform vec3 ambientLight;
uniform vec3 diffuseLight;

uniform float lightRadius;
uniform vec3 lightPosition;

uniform sampler2D albedoTex, normalTex, positionTex;

void main() {
  // get screen-space position of light sphere
  // (remember to do perspective division.)
  vec2 uv = (vPosition.xy / vPosition.w) * 0.5 + 0.5;

  vec3 albedo = texture2D(albedoTex, uv).xyz;
  vec3 n = texture2D(normalTex, uv).xyz;
  vec4 position = texture2D(positionTex, uv);

  vec3 toLightVector = position.xyz - lightPosition;
  float lightDist = length(toLightVector);
  vec3 l = -toLightVector / lightDist;

  // fake z-text
  float ztest = step(0.0, lightRadius - lightDist);

  float attenuation = (1.0 - lightDist / lightRadius);

  vec3 ambient = ambientLight * albedo;
  vec3 diffuse = diffuseLight * albedo * clamp(dot(n, l), 0.0, 1.0);

  gl_FragColor = vec4((diffuse + ambient) * ztest * attenuation, 1.0);
}